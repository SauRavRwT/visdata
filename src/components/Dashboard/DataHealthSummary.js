import React from "react";

function DataHealthSummary({ types, healthSummary }) {
  if (!types || !healthSummary) return null;

  return (
    <div className="card shadow-sm mb-3 data-health-card">
      <div className="card-body">
        <h6 className="fw-semibold mb-3">Data Health Summary</h6>
        <div className="small">
          {Object.keys(types).map((col) => {
            const s = healthSummary[col] || { missing: 0, uniqueCount: 0, outliers: [] };
            return (
              <div key={col} className="mb-2">
                <strong>{col}</strong> — <em>{types[col]}</em>
                <div className="text-muted small">
                  Missing: {s.missing} • Unique: {s.uniqueCount} • Outliers: {s.outliers ? s.outliers.length : 0}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DataHealthSummary;
