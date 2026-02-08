import React from "react";

function DataPreview({ data, columns }) {
  return (
    <div className="card shadow-sm data-preview-card">
      <div className="card-body">
        <h6 className="fw-semibold mb-3 preview-title">Data Preview</h6>
        <div className="table-responsive">
          <table className="table table-sm table-striped custom-table">
            <thead className="table-light">
              <tr>
                {columns.map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length > 10 && (
            <div className="text-center mt-2">
              <small className="text-muted row-count">
                Showing first 10 of {data.length} rows
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataPreview;
