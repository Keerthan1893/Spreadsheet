import React, { useContext } from 'react';
import { FormatBold, FormatItalic, Add } from '@mui/icons-material';
import { SpreadsheetContext } from '../context/SpreadsheetContext';

const Toolbar = () => {
  const { selectedCell, updateCellStyle } = useContext(SpreadsheetContext);

  const applyFormatting = (style) => {
    if (!selectedCell) return;
    updateCellStyle(selectedCell, style);
  };

  return (
    <div className="toolbar">
      <button onClick={() => applyFormatting({ fontWeight: 'bold' })}>
        <FormatBold />
      </button>
      <button onClick={() => applyFormatting({ fontStyle: 'italic' })}>
        <FormatItalic />
      </button>
      <button onClick={() => console.log('Add Row Logic')}>
        <Add /> Row
      </button>
    </div>
  );
};

export default Toolbar;
