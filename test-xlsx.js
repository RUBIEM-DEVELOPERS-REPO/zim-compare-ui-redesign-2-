const XLSX = require('xlsx');

// Create a workbook with a title row, some blank rows, then headers, then data
const ws = XLSX.utils.aoa_to_sheet([
  ["Zimbabwe Universities and Colleges - Programmes and Fee Snapshot", null, null, null],
  [null, null, null, null],
  ["Institution", "Location", "Fee Min (USD/Sem)", "Fee Max (USD/Sem)"],
  ["Test Uni 1", "Harare", 500, 1000],
  ["Test Uni 2", "Bulawayo", 600, 1200]
]);

// Test 1: default
console.log("DEFAULT PARSE:");
console.log(XLSX.utils.sheet_to_json(ws));

// Find header row
const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 });
let headerRowIndex = 0;
for (let i = 0; i < Math.min(rawData.length, 10); i++) {
    const rowVals = (rawData[i] || []).filter(Boolean).map(String).join(" ").toLowerCase();
    if (rowVals.includes("university") || rowVals.includes("location") || rowVals.includes("institution")) {
        headerRowIndex = i;
        break;
    }
}
console.log("\nDETECTED HEADER ROW INDEX:", headerRowIndex);

// Test 2: with range
console.log("\nPARSE WITH RANGE:", headerRowIndex);
console.log(XLSX.utils.sheet_to_json(ws, { range: headerRowIndex }));
