import React, { useState, useRef, useEffect } from "react";
import ChartSettings from "./ChartSettings/ChartSettings";
import ChartVisualization from "./ChartVisualization/ChartVisualization";
import DataPreview from "./DataPreview/DataPreview";
import DataHealthSummary from "./DataHealthSummary";
import "./Dashboard.css";
import {
  detectColumnTypes,
  computeDataHealth,
  applyFilters,
  groupAndAggregate,
} from "../utils/dataUtils";

function Dashboard({ data, columns, onReset }) {
  const [selectedX, setSelectedX] = useState(columns[0] || "");
  const [selectedY, setSelectedY] = useState(columns[1] ? [columns[1]] : []);
  const [chartType, setChartType] = useState("line");
  const chartRef = useRef(null);

  const [types, setTypes] = useState({});
  const [health, setHealth] = useState({});
  const [filters, setFilters] = useState({});
  const [filteredData, setFilteredData] = useState(data);
  const [groupBy, setGroupBy] = useState("");
  const [aggFns, setAggFns] = useState({});
  const [uniqueValues, setUniqueValues] = useState({});

  // compute types and health when data changes
  useEffect(() => {
    if (!data || data.length === 0 || !columns) return;
    const t = detectColumnTypes(data, columns);
    setTypes(t);
    const h = computeDataHealth(data, columns, t);
    setHealth(h.health || {});
    // compute unique values for categorical selects
    const u = {};
    columns.forEach((col) => {
      u[col] = Array.from(new Set(data.map((r) => (r[col] === undefined || r[col] === null ? "" : String(r[col]))))).slice(0, 200);
    });
    setUniqueValues(u);
    // reset filters and derived data
    setFilters({});
    setFilteredData(data);
    setGroupBy("");
    setAggFns({});
  }, [data, columns]);

  // apply filters and grouping
  useEffect(() => {
    if (!data) return;
    let d = applyFilters(data, filters, types);
    if (groupBy) {
      d = groupAndAggregate(d, groupBy, aggFns, selectedY);
    }
    setFilteredData(d);
  }, [data, filters, types, groupBy, aggFns, selectedY]);

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
          types={types}
          filters={filters}
          setFilters={setFilters}
          groupBy={groupBy}
          setGroupBy={setGroupBy}
          aggFns={aggFns}
          setAggFns={setAggFns}
          uniqueValues={uniqueValues}
        />
      </div>

      {/* Main Content */}
      <div className="col-lg-9">
        <ChartVisualization
          data={filteredData}
          rawData={data}
          types={types}
          selectedX={selectedX}
          selectedY={selectedY}
          chartType={chartType}
          chartRef={chartRef}
          onSelectCategory={(col, value) => {
            // cross-filter: set categorical filter to only value
            setFilters((prev) => ({
              ...prev,
              [col]: { selected: [String(value)] },
            }));
          }}
        />
        <DataPreview data={data} columns={columns} />
        <div className="mt-3">
          <DataHealthSummary types={types} healthSummary={health} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
