import React, { useState, useRef } from "react";
import ChartSettings from "./ChartSettings/ChartSettings";
import ChartVisualization from "./ChartVisualization/ChartVisualization";
import DataPreview from "./DataPreview/DataPreview";
import "./Dashboard.css";

function Dashboard({ data, columns, onReset }) {
  const [selectedX, setSelectedX] = useState(columns[0] || "");
  const [selectedY, setSelectedY] = useState(columns[1] ? [columns[1]] : []);
  const [chartType, setChartType] = useState("line");
  const chartRef = useRef(null);

  return (
    <div className="row g-4">
      {/* Sidebar */}
      <div className="col-lg-3">
        <ChartSettings
          columns={columns}
          selectedX={selectedX}
          selectedY={selectedY}
          chartType={chartType}
          onXChange={setSelectedX}
          onYChange={setSelectedY}
          onChartTypeChange={setChartType}
          chartRef={chartRef}
          onReset={onReset}
        />
      </div>

      {/* Main Content */}
      <div className="col-lg-9">
        <ChartVisualization
          data={data}
          selectedX={selectedX}
          selectedY={selectedY}
          chartType={chartType}
          chartRef={chartRef}
        />
        <DataPreview data={data} columns={columns} />
      </div>
    </div>
  );
}

export default Dashboard;
