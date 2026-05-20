import React from 'react';
import './ResetButton.css';

const ResetButton = ({ resetBoard, resetAll }) => {
  return (
    <div className='reset-btn-div'>
      <button className='reset-btn' onClick={resetBoard}>Restart Game</button>
      <button className='play-again-btn' onClick={resetAll}>Play again</button>
    </div>
  );
};

export default ResetButton;
