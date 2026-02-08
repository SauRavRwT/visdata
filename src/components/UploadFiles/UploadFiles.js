import React from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                fill="currentColor"
                className="bi bi-cloud-upload"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"
                />
                <path
                  fillRule="evenodd"
                  d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"
                />
              </svg>
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
