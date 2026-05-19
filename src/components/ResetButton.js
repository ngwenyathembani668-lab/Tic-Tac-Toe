import React from 'react';
import './ResetButton.css';

const ResetButton = ({resetBoard}) => {
  return (
    <div className='reset-btn-div'>
      <button className='reset-btn' onClick={resetBoard}>Restart Game</button>
    </div>
  );
};

export default ResetButton;
