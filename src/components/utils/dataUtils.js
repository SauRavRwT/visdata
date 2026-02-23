// Lightweight data profiling and filtering utilities
export function detectColumnTypes(data, columns) {
  const types = {};
  columns.forEach((col) => {
    let numericCount = 0;
    let dateCount = 0;
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i][col];
      if (v === null || v === undefined || v === "") continue;
      total++;
      const asNum = parseFloat(v);
      if (!Number.isNaN(asNum) && isFinite(asNum)) numericCount++;
      const d = Date.parse(v);
      if (!Number.isNaN(d)) dateCount++;
    }
    // Heuristics: >80% numeric => numeric, >80% date => datetime, else categorical
    if (total > 0 && numericCount / total > 0.8) types[col] = "numeric";
    else if (total > 0 && dateCount / total > 0.8) types[col] = "datetime";
    else types[col] = "categorical";
  });
  return types;
}

export function computeDataHealth(data, columns, types) {
  const health = {};
  const seenRows = new Set();
  const duplicates = [];
  for (let i = 0; i < data.length; i++) {
    const key = JSON.stringify(data[i]);
    if (seenRows.has(key)) duplicates.push(i);
    else seenRows.add(key);
  }

  columns.forEach((col) => {
    const colStats = { missing: 0, unique: new Set(), outliers: [] };
    const vals = [];
    for (let i = 0; i < data.length; i++) {
      const v = data[i][col];
      if (v === null || v === undefined || v === "") colStats.missing++;
      else {
        colStats.unique.add(String(v));
        if (types[col] === "numeric") {
          const n = parseFloat(v);
          if (!Number.isNaN(n) && isFinite(n)) vals.push(n);
        }
      }
    }

    // detect outliers using simple IQR
    if (vals.length >= 4) {
      const sorted = vals.slice().sort((a, b) => a - b);
      const q1 = sorted[Math.floor((sorted.length / 4))];
      const q3 = sorted[Math.ceil((sorted.length * 3) / 4)];
      const iqr = q3 - q1;
      const lower = q1 - 1.5 * iqr;
      const upper = q3 + 1.5 * iqr;
      for (let i = 0; i < data.length; i++) {
        const n = parseFloat(data[i][col]);
        if (!Number.isNaN(n) && (n < lower || n > upper)) colStats.outliers.push(i);
      }
    }

    colStats.uniqueCount = colStats.unique.size;
    health[col] = colStats;
  });

  return { health, duplicateCount: duplicates.length };
}

export function applyFilters(data, filters, types) {
  if (!filters || Object.keys(filters).length === 0) return data;
  return data.filter((row) => {
    for (const col of Object.keys(filters)) {
      const f = filters[col];
      if (!f) continue;
      const val = row[col];
      if (types[col] === "numeric") {
        const n = parseFloat(val);
        if (f.min !== undefined && n < f.min) return false;
        if (f.max !== undefined && n > f.max) return false;
      } else {
        // categorical: selected array
        if (Array.isArray(f.selected) && f.selected.length > 0) {
          if (!f.selected.includes(String(val))) return false;
        }
      }
    }
    return true;
  });
}

export function groupAndAggregate(data, groupBy, aggFns = {}, columns = []) {
  if (!groupBy) return data;
  const map = new Map();
  data.forEach((row) => {
    const key = String(row[groupBy]);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(row);
  });
  const out = [];
  for (const [key, rows] of map.entries()) {
    const obj = { [groupBy]: key };
    columns.forEach((col) => {
      const fn = aggFns[col] || "sum";
      const vals = rows.map((r) => parseFloat(r[col]) || 0);
      if (fn === "sum") obj[col] = vals.reduce((a, b) => a + b, 0);
      else if (fn === "avg") obj[col] = vals.reduce((a, b) => a + b, 0) / vals.length || 0;
      else if (fn === "count") obj[col] = rows.length;
    });
    out.push(obj);
  }
  return out;
}
