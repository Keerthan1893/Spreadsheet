import React, { useState } from 'react';

const DataValidation = () => {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validate = (val) => {
    if (isNaN(val)) {
      setError('Only numbers allowed');
    } else {
      setError('');
    }
    setValue(val);
  };

  return (
    <div>
      <input type="text" value={value} onChange={(e) => validate(e.target.value)} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DataValidation;
