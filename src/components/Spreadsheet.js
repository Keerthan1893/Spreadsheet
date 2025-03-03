import React, { useState } from "react";
import FormulaBar from "./FormulaBar";
import "./Spreadsheet.css"; // Import CSS for styling

const generateGrid = (rows, cols) => {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => "")
  );
};

const Spreadsheet = () => {
  const [grid, setGrid] = useState(generateGrid(20, 10)); // Default 20x10
  const [formulas, setFormulas] = useState({}); // Store formulas separately
  const [selectedCell, setSelectedCell] = useState({ row: null, col: null });

  // Function to convert Excel-style addresses (A1, B2) to row/col indexes
  const cellToIndex = (cell) => {
    const match = cell.match(/^([A-Z]+)(\d+)$/);
    if (!match) return null;
    const col = match[1].charCodeAt(0) - 65; // Convert 'A' to 0, 'B' to 1...
    const row = parseInt(match[2], 10) - 1; // Convert '1' to 0, '2' to 1...
    return { row, col };
  };

  // Function to evaluate formulas
  const evaluateFormula = (formula) => {
    if (!formula.startsWith("=")) return formula; // Not a formula, return as-is

    try {
      const expression = formula.slice(1); // Remove '='
      let parsedExpression = expression;

      // Replace cell references with actual values
      parsedExpression = parsedExpression.replace(/[A-Z]+\d+/g, (match) => {
        const { row, col } = cellToIndex(match) || {};
        return row !== undefined && col !== undefined ? parseFloat(grid[row][col]) || 0 : 0;
      });

      // Support basic functions
      if (expression.startsWith("SUM(")) {
        const range = expression.match(/SUM\((.*)\)/)[1];
        return calculateRange(range, "SUM");
      }
      if (expression.startsWith("AVERAGE(")) {
        const range = expression.match(/AVERAGE\((.*)\)/)[1];
        return calculateRange(range, "AVERAGE");
      }
      if (expression.startsWith("MAX(")) {
        const range = expression.match(/MAX\((.*)\)/)[1];
        return calculateRange(range, "MAX");
      }
      if (expression.startsWith("MIN(")) {
        const range = expression.match(/MIN\((.*)\)/)[1];
        return calculateRange(range, "MIN");
      }
      if (expression.startsWith("COUNT(")) {
        const range = expression.match(/COUNT\((.*)\)/)[1];
        return calculateRange(range, "COUNT");
      }

      return eval(parsedExpression); // Evaluate arithmetic expressions (e.g., =A1+B2)
    } catch (error) {
      return "Error"; // Handle errors gracefully
    }
  };

  // Function to calculate range-based formulas (SUM, AVERAGE, etc.)
  const calculateRange = (range, type) => {
    const [start, end] = range.split(":");
    const startIdx = cellToIndex(start);
    const endIdx = cellToIndex(end);

    if (!startIdx || !endIdx) return "Error";

    const values = [];
    for (let r = startIdx.row; r <= endIdx.row; r++) {
      for (let c = startIdx.col; c <= endIdx.col; c++) {
        values.push(parseFloat(grid[r][c]) || 0);
      }
    }

    switch (type) {
      case "SUM":
        return values.reduce((acc, val) => acc + val, 0);
      case "AVERAGE":
        return values.length ? values.reduce((acc, val) => acc + val, 0) / values.length : 0;
      case "MAX":
        return Math.max(...values);
      case "MIN":
        return Math.min(...values);
      case "COUNT":
        return values.length;
      default:
        return "Error";
    }
  };

  // Handle cell updates
  const handleCellChange = (row, col, value) => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);

    if (value.startsWith("=")) {
      setFormulas({ ...formulas, [`${row},${col}`]: value });
    } else {
      const newFormulas = { ...formulas };
      delete newFormulas[`${row},${col}`]; // Remove formula if replaced with plain value
      setFormulas(newFormulas);
    }
  };

  // Handle applying formulas from Formula Bar
  const applyFormula = (formula) => {
    if (selectedCell.row === null || selectedCell.col === null) return;
    handleCellChange(selectedCell.row, selectedCell.col, formula);
  };

  const addRow = () => {
    setGrid([...grid, Array(grid[0].length).fill("")]);
  };

  const addColumn = () => {
    setGrid(grid.map((row) => [...row, ""]));
  };

  return (
    <div className="spreadsheet-container">
      {/* Formula Bar */}
      <FormulaBar onApplyFormula={applyFormula} />

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={addRow}>➕ Add Row</button>
        <button onClick={addColumn}>➕ Add Column</button>
      </div>

      {/* Spreadsheet Table */}
      <div className="table-container">
        <table className="spreadsheet">
          <thead>
            <tr>
              <th></th> {/* Top-left empty corner */}
              {[...Array(grid[0].length)].map((_, colIndex) => (
                <th key={colIndex}>{String.fromCharCode(65 + colIndex)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>{rowIndex + 1}</th> {/* Row headers */}
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={selectedCell.row === rowIndex && selectedCell.col === colIndex ? "active" : ""}
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                  >
                    <input
                      type="text"
                      value={formulas[`${rowIndex},${colIndex}`] || evaluateFormula(cell)}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;
