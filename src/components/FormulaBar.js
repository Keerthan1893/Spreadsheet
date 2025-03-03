import React, { useState } from "react";

const FormulaBar = ({ onApplyFormula }) => {
  const [formula, setFormula] = useState("");

  const handleSubmit = () => {
    onApplyFormula(formula);
    setFormula("");
  };

  return (
    <div className="formula-bar">
      <input
        type="text"
        value={formula}
        onChange={(e) => setFormula(e.target.value)}
        placeholder="Enter formula (e.g. =SUM(A1:A5))"
      />
      <button onClick={handleSubmit}>Apply</button>
    </div>
  );
};

export default FormulaBar;
