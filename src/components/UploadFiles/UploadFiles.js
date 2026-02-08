import React from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { MdUpload } from "react-icons/md";

function UploadFiles({ onDataUpload }) {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const ext = file.name.split(".").pop().toLowerCase();
    const reader = new FileReader();

    reader.onload = (e) => {
      let jsonData;

      if (ext === "json") {
        const json = JSON.parse(e.target.result);
        // Assume array of objects
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
        // For csv, xlsx, xls
        const workbook = XLSX.read(e.target.result, {
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

    if (ext === "csv" || ext === "json") {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
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
              className={`upload-dropzone border border-2 rounded-4 p-5 ${
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadFiles;
