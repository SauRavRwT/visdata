import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { MdUpload, MdLink } from "react-icons/md";

function UploadFiles({ onDataUpload }) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const processData = (data, ext, fileName = "") => {
    let jsonData;

    if (ext === "json") {
      const json = typeof data === "string" ? JSON.parse(data) : data;
      if (
        Array.isArray(json) &&
        json.length > 0 &&
        typeof json[0] === "object"
      ) {
        const headers = Object.keys(json[0]);
        jsonData = [
          headers,
          ...json.map((obj) => headers.map((key) => obj[key])),
        ];
      } else {
        alert("JSON file must be an array of objects.");
        return;
      }
    } else {
      const workbook = XLSX.read(data, {
        type: ext === "csv" ? "string" : "binary",
      });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    }

    const headers = jsonData[0];
    if (!headers || headers.length === 0) {
      alert("No data found in the file.");
      return;
    }

    const rows = jsonData.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    onDataUpload(rows, headers);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const ext = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (e) => {
      processData(e.target.result, ext, file.name);
    };

    if (ext === "csv" || ext === "json") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      alert("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    try {
      // Determine file type from URL
      const urlLower = url.toLowerCase();
      let ext = "csv"; // default
      if (urlLower.includes(".xlsx")) ext = "xlsx";
      else if (urlLower.includes(".xls")) ext = "xls";
      else if (urlLower.includes(".json")) ext = "json";
      else if (urlLower.includes(".csv")) ext = "csv";

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let data;
      if (ext === "json") {
        data = await response.json();
        processData(data, ext);
      } else if (ext === "csv") {
        data = await response.text();
        processData(data, ext);
      } else {
        // For Excel files
        const arrayBuffer = await response.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        processData(binary, ext);
      }

      setUrl("");
      setShowUrlInput(false);
    } catch (error) {
      alert(`Failed to load file from URL: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
      "application/json": [".json"],
    },
  });

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-6">
        <div className="card shadow-sm upload-card rounded-4">
          <div className="card-body text-center p-5">
            <div className="upload-icon mb-3">
              <MdUpload size={64} className="text-dark" />
            </div>
            <h4 className="fw-semibold mb-3">Upload Data File</h4>
            <p className="text-muted mb-4">
              Drag & drop or click to upload Excel (.xls, .xlsx), CSV, or JSON
              files
            </p>

            <div
              {...getRootProps()}
              className={`upload-dropzone border border-2 rounded-4 p-5 mb-3 ${
                isDragActive ? "dropzone-active" : ""
              }`}
            >
              <input {...getInputProps()} />
              <p className="mb-0 text-muted">
                {isDragActive
                  ? "Drop the file here..."
                  : "Click or drag file to this area"}
              </p>
            </div>

            <div className="text-center">
              <button
                className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center gap-2 rounded-3"
                onClick={() => setShowUrlInput(!showUrlInput)}
                type="button"
              >
                <MdLink size={18} />
                {showUrlInput ? "Hide URL Input" : "Load from URL"}
              </button>
            </div>

            {showUrlInput && (
              <form onSubmit={handleUrlSubmit} className="mt-3">
                <div className="input-group">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Enter file URL (e.g., https://example.com/data.csv)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    className="btn btn-dark"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Load"}
                  </button>
                </div>
                <small className="text-muted d-block mt-2">
                  Supports .csv, .xlsx, .xls, and .json files
                </small>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadFiles;
