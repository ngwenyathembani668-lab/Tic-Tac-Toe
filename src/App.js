import React, { useReducer } from 'react';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';
import ResetButton from './components/ResetButton';

const WIN_CONDITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

const initialState = {
  board: Array(9).fill(null),
  xPlaying: true,
  scores: {
    xScore: 0,
    oScore: 0,
  },
  gameOver: false,
  status: 'Next Player: X',
};

const ACTIONS = {
  MAKE_MOVE: 'MAKE_MOVE',
  RESET: 'RESET',
  RESET_ALL: 'RESET_ALL',
};

const checkWinner = (board) => {
  for (let i = 0; i < WIN_CONDITIONS.length; i++) {
    const [x, y, z] = WIN_CONDITIONS[i];
    if (board[x] && board[x] === board[y] && board[y] === board[z]) {
      return board[x];
    }
  }
  return null;
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.MAKE_MOVE: {
      const idx = action.payload;
      if (state.gameOver || state.board[idx]) {
        return state;
      }

      const marker = state.xPlaying ? 'X' : 'O';
      const board = state.board.map((value, i) => (i === idx ? marker : value));
      const winner = checkWinner(board);
      const boardFull = board.every(Boolean);

      if (winner) {
        return {
          ...state,
          board,
          gameOver: true,
          status: `Winner: ${winner}`,
          scores: {
            xScore: state.scores.xScore + (winner === 'X' ? 1 : 0),
            oScore: state.scores.oScore + (winner === 'O' ? 1 : 0),
          },
        };
      }

      if (boardFull) {
        return {
          ...state,
          board,
          gameOver: true,
          status: 'Draw!',
        };
      }

      const nextPlayer = !state.xPlaying;
      return {
        ...state,
        board,
        xPlaying: nextPlayer,
        status: `Next Player: ${nextPlayer ? 'X' : 'O'}`,
      };
    }
    case ACTIONS.RESET:
      return {
        ...state,
        board: Array(9).fill(null),
        xPlaying: true,
        gameOver: false,
        status: 'Next Player: X',
      };
    case ACTIONS.RESET_ALL:
      return initialState;
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { board, xPlaying, scores, status } = state;

  const handleBoxClick = (boxIdx) => {
    dispatch({ type: ACTIONS.MAKE_MOVE, payload: boxIdx });
  };

  const resetBoard = () => {
    dispatch({ type: ACTIONS.RESET });
  };

  const resetAll = () => {
    dispatch({ type: ACTIONS.RESET_ALL });
  };

  return (
    <>
      <Scoreboard scores={scores} xPlaying={xPlaying} />
      <div className='status'>{status}</div>
      <Board board={board} onClick={handleBoxClick} />
      <ResetButton resetBoard={resetBoard} resetAll={resetAll} />
    </>
  );
}

export default App;
