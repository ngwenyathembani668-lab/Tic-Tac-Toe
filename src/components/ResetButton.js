import React from 'react';
import './ResetButton.css';

const ResetButton = ({ resetBoard, resetAll }) => {
  return (
    <div className='reset-btn-div'>
      <button className='reset-btn' onClick={resetBoard}>Play again</button>
      <button className='play-again-btn' onClick={resetAll}>Reset score</button>
    </div>
  );
};

export default ResetButton;
