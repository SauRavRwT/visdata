import React from "react";
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

const COLORS = [
  "#0d6efd",
  "#198754",
  "#dc3545",
  "#ffc107",
  "#6610f2",
  "#20c997",
];

function ChartVisualization({ data, selectedX, selectedY, chartType, chartRef }) {
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
    <div className="card shadow-sm mb-4 chart-card">
      <div className="card-body">
        <h5 className="fw-semibold mb-3 chart-title">Visualization</h5>
        <div ref={chartRef} className="chart-container">
          {renderChart()}
        </div>
      </div>
    </div>
  );
}

export default ChartVisualization;
