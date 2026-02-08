import React from "react";
import html2canvas from "html2canvas";
import { MdDownload, MdRefresh } from "react-icons/md";

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
      },
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
          <MdDownload className="me-2" />
          Download Chart
        </button>

        <button
          className="btn btn-outline-secondary w-100 reset-btn"
          onClick={onReset}
        >
          <MdRefresh className="me-2" />
          Upload New File
        </button>
      </div>
    </div>
  );
}

export default ChartSettings;
