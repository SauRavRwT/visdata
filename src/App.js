import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const COLORS = [
  "#0d6efd",
  "#198754",
  "#dc3545",
  "#ffc107",
  "#6610f2",
  "#20c997",
];

function App() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedX, setSelectedX] = useState("");
  const [selectedY, setSelectedY] = useState([]);
  const [chartType, setChartType] = useState("line");
  const chartRef = useRef(null);

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

      setData(rows);
      setColumns(headers);
      setSelectedX(headers[0] || "");
      setSelectedY(headers[1] ? [headers[1]] : []);
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
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
  });

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

  const chartData = data.map((row) => {
    const obj = {};
    obj[selectedX] = row[selectedX];
    selectedY.forEach((y) => (obj[y] = row[y]));
    return obj;
  });

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 10 },
    };

    if (chartType === "line") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedX} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedY.map((y, i) => (
              <Line
                key={y}
                type="monotone"
                dataKey={y}
                stroke={COLORS[i % COLORS.length]}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "bar") {
      return (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedX} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedY.map((y, i) => (
              <Bar key={y} dataKey={y} fill={COLORS[i % COLORS.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (chartType === "pie") {
      const pieData = selectedY.map((y, i) => ({
        name: y,
        value: data.reduce((sum, row) => sum + (parseFloat(row[y]) || 0), 0),
        color: COLORS[i % COLORS.length],
      }));

      return (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return null;
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark shadow-sm">
        <div className="container-fluid px-4">
          <h1 className="navbar-brand fw-semibold">Data Visualizer</h1>
        </div>
      </nav>

      <div className="container-fluid min-vh-100 px-4 py-4">
        {!data.length ? (
          /* Upload Screen */
          <div className="row justify-content-center mt-5">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="card-body text-center p-5">
                  <h4 className="fw-semibold mb-3">Upload Data File</h4>
                  <p className="text-muted mb-4">
                    Drag & drop or click to upload Excel (.xls, .xlsx), CSV, or
                    JSON files
                  </p>

                  <div
                    {...getRootProps()}
                    className={`border border-2 rounded p-5 ${
                      isDragActive
                        ? "border-primary bg-primary bg-opacity-10"
                        : "border-secondary"
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
        ) : (
          /* Dashboard */
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="text-uppercase mb-3">
                    Chart Settings
                  </h6>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">X-Axis</label>
                    <select
                      className="form-select rounded-3"
                      value={selectedX}
                      onChange={(e) => setSelectedX(e.target.value)}
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
                        setSelectedY(
                          [...e.target.selectedOptions].map((o) => o.value)
                        )
                      }
                    >
                      {columns.map((col) => (
                        <option key={col}>{col}</option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Chart Type</label>
                    <select
                      className="form-select"
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                    >
                      <option value="line">Line</option>
                      <option value="bar">Bar</option>
                      <option value="pie">Pie</option>
                    </select>
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    onClick={handleDownload}
                  >
                    Download Chart
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-lg-9">
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="fw-semibold mb-3">Visualization</h5>
                  <div ref={chartRef}>{renderChart()}</div>
                </div>
              </div>

              <div className="card shadow-sm">
                <div className="card-body">
                  <h6 className="fw-semibold mb-3">Data Preview</h6>
                  <div className="table-responsive">
                    <table className="table table-sm table-striped">
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
                      <small className="text-muted">
                        Showing first 10 of {data.length} rows
                      </small>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
