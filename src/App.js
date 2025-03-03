import React from 'react';
import { SpreadsheetProvider } from './context/SpreadsheetContext';
import Toolbar from './components/Toolbar';
import FormulaBar from './components/FormulaBar';
import Spreadsheet from "./components/Spreadsheet";

const App = () => {
  return (
    <SpreadsheetProvider>
      <div className="app">
        <Toolbar />
        <FormulaBar onApplyFormula={(formula) => console.log('Formula:', formula)} />
        <Spreadsheet />
      </div>
    </SpreadsheetProvider>
  );
};

export default App;
