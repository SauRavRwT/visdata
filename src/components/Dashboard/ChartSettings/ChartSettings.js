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
  types = {},
  filters = {},
  setFilters = () => {},
  uniqueValues = {},
  groupBy,
  setGroupBy = () => {},
  aggFns = {},
  setAggFns = () => {},
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

        <div className="mb-3">
          <label className="form-label fw-semibold">Filters</label>
          <div className="small text-muted mb-2">Filter columns to slice data</div>
          <div style={{ maxHeight: 220, overflow: "auto" }}>
            {columns.map((col) => {
              const t = types[col] || "categorical";
              const f = filters[col] || {};
              if (t === "numeric") {
                return (
                  <div key={col} className="mb-2">
                    <div className="fw-semibold">{col}</div>
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="min"
                        value={f.min ?? ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [col]: { ...(prev[col] || {}), min: e.target.value === "" ? undefined : parseFloat(e.target.value) },
                          }))
                        }
                      />
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="max"
                        value={f.max ?? ""}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            [col]: { ...(prev[col] || {}), max: e.target.value === "" ? undefined : parseFloat(e.target.value) },
                          }))
                        }
                      />
                    </div>
                  </div>
                );
              }

              // categorical
              return (
                <div key={col} className="mb-2">
                  <div className="fw-semibold">{col}</div>
                  <select
                    className="form-select form-select-sm"
                    multiple
                    size={3}
                    value={(f.selected && f.selected.map(String)) || []}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [col]: { ...(prev[col] || {}), selected: [...e.target.selectedOptions].map((o) => o.value) },
                      }))
                    }
                  >
                    {(uniqueValues[col] || []).map((val) => (
                      <option key={val} value={val}>
                        {val}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Group / Aggregate</label>
          <select
            className="form-select mb-2"
            value={groupBy || ""}
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <option value="">No Grouping</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          {selectedY.length > 0 && (
            <div className="small text-muted">Aggregation per selected Y</div>
          )}
          {selectedY.map((y) => (
            <div key={y} className="d-flex gap-2 align-items-center mb-1">
              <div className="flex-grow-1">{y}</div>
              <select
                className="form-select form-select-sm w-auto"
                value={aggFns[y] || "sum"}
                onChange={(e) => setAggFns((prev) => ({ ...prev, [y]: e.target.value }))}
              >
                <option value="sum">sum</option>
                <option value="avg">avg</option>
                <option value="count">count</option>
              </select>
            </div>
          ))}
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
