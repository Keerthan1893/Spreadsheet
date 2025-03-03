import React, { createContext, useState } from 'react';

export const SpreadsheetContext = createContext();

export const SpreadsheetProvider = ({ children }) => {
  const [cells, setCells] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);

  const updateCellStyle = (cellId, newStyle) => {
    setCells((prev) => ({
      ...prev,
      [cellId]: { ...prev[cellId], style: { ...prev[cellId]?.style, ...newStyle } }
    }));
  };

  return (
    <SpreadsheetContext.Provider value={{ cells, setCells, selectedCell, setSelectedCell, updateCellStyle }}>
      {children}
    </SpreadsheetContext.Provider>
  );
};
