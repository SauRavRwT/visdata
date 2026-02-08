import React from "react";
import html2canvas from "html2canvas";

function ChartSettings({
  columns,
  selectedX,
  selectedY,
  chartType,
  onXChange,
  onYChange,
  onChartTypeChange,
  chartRef,
  onReset,
}) {
  const handleDownload = () => {
    if (!chartRef.current) return;

    html2canvas(chartRef.current, { backgroundColor: "#ffffff" }).then(
      (canvas) => {
        const link = document.createElement("a");
        link.download = "chart.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    );
  };

  return (
    <div className="card shadow-sm chart-settings-card">
      <div className="card-body">
        <h6 className="text-uppercase mb-3 settings-title">Chart Settings</h6>

        <div className="mb-3">
          <label className="form-label fw-semibold">X-Axis</label>
          <select
            className="form-select rounded-3"
            value={selectedX}
            onChange={(e) => onXChange(e.target.value)}
          >
            {columns.map((col) => (
              <option key={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Y-Axis</label>
          <select
            className="form-select"
            multiple
            value={selectedY}
            onChange={(e) =>
              onYChange([...e.target.selectedOptions].map((o) => o.value))
            }
            size={Math.min(columns.length, 5)}
          >
            {columns.map((col) => (
              <option key={col}>{col}</option>
            ))}
          </select>
          <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
        </div>

        <div className="mb-4">
          <label className="form-label fw-semibold">Chart Type</label>
          <select
            className="form-select"
            value={chartType}
            onChange={(e) => onChartTypeChange(e.target.value)}
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <button
          className="btn btn-primary w-100 mb-2 download-btn"
          onClick={handleDownload}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-download me-2"
            viewBox="0 0 16 16"
          >
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
          </svg>
          Download Chart
        </button>

        <button className="btn btn-outline-secondary w-100 reset-btn" onClick={onReset}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-counterclockwise me-2"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
          </svg>
          Upload New File
        </button>
      </div>
    </div>
  );
}

export default ChartSettings;
