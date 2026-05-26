import React, { useEffect, useReducer } from 'react';
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
  mode: 'human',
  difficulty: 'easy',
  aiSymbol: 'O',
};

const ACTIONS = {
  MAKE_MOVE: 'MAKE_MOVE',
  RESET: 'RESET',
  RESET_ALL: 'RESET_ALL',
  SET_MODE: 'SET_MODE',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
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

const getRandomMove = (board) => {
  const availableMoves = board
    .map((value, index) => (value === null ? index : null))
    .filter((value) => value !== null);

  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const getWinnerForBoard = (board) => {
  for (let i = 0; i < WIN_CONDITIONS.length; i++) {
    const [x, y, z] = WIN_CONDITIONS[i];
    if (board[x] && board[x] === board[y] && board[y] === board[z]) {
      return board[x];
    }
  }

  return null;
};

const getMinimaxMove = (board, aiSymbol, humanSymbol) => {
  const getAvailableMoves = (currentBoard) =>
    currentBoard
      .map((value, index) => (value === null ? index : null))
      .filter((value) => value !== null);

  const getScore = (currentBoard, isMaximizing) => {
    const winner = getWinnerForBoard(currentBoard);

    if (winner === aiSymbol) {
      return 10;
    }

    if (winner === humanSymbol) {
      return -10;
    }

    if (currentBoard.every(Boolean)) {
      return 0;
    }

    const moves = getAvailableMoves(currentBoard);

    if (isMaximizing) {
      let bestScore = -Infinity;

      for (const move of moves) {
        const nextBoard = currentBoard.map((value, index) =>
          index === move ? aiSymbol : value
        );

        bestScore = Math.max(bestScore, getScore(nextBoard, false));
      }

      return bestScore;
    }

    let bestScore = Infinity;

    for (const move of moves) {
      const nextBoard = currentBoard.map((value, index) =>
        index === move ? humanSymbol : value
      );

      bestScore = Math.min(bestScore, getScore(nextBoard, true));
    }

    return bestScore;
  };

  const availableMoves = getAvailableMoves(board);
  let bestMove = availableMoves[0];
  let bestScore = -Infinity;

  for (const move of availableMoves) {
    const nextBoard = board.map((value, index) =>
      index === move ? aiSymbol : value
    );

    const score = getScore(nextBoard, false);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};

const getComputerMove = (board, difficulty) => {
  if (difficulty === 'easy') {
    return getRandomMove(board);
  }

  return getMinimaxMove(board, 'O', 'X');
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_MODE:
      return {
        ...state,
        mode: action.payload,
      };

    case ACTIONS.SET_DIFFICULTY:
      return {
        ...state,
        difficulty: action.payload,
      };

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
  const { board, xPlaying, scores, status, gameOver, mode, difficulty } = state;

  useEffect(() => {
    if (gameOver || mode !== 'computer' || xPlaying) {
      return;
    }

    const timerId = window.setTimeout(() => {
      const aiMove = getComputerMove(board, difficulty);
      dispatch({ type: ACTIONS.MAKE_MOVE, payload: aiMove });
    }, 300);

    return () => window.clearTimeout(timerId);
  }, [board, difficulty, gameOver, mode, xPlaying]);

  const handleBoxClick = (boxIdx) => {
    dispatch({ type: ACTIONS.MAKE_MOVE, payload: boxIdx });
  };

  const resetBoard = () => {
    dispatch({ type: ACTIONS.RESET });
  };

  const resetAll = () => {
    dispatch({ type: ACTIONS.RESET_ALL });
  };

  const handleModeChange = (newMode) => {
    dispatch({ type: ACTIONS.SET_MODE, payload: newMode });
  };

  const handleDifficultyChange = (newDifficulty) => {
    dispatch({ type: ACTIONS.SET_DIFFICULTY, payload: newDifficulty });
  };

  return (
    <>
      <Scoreboard scores={scores} xPlaying={xPlaying} />
      <div className='mode-selection'>
        <label>
          <input
            type='radio'
            name='mode'
            checked={mode === 'human'}
            onChange={() => handleModeChange('human')}
          />
          Human vs Human
        </label>

        <label>
          <input
            type='radio'
            name='mode'
            checked={mode === 'computer'}
            onChange={() => handleModeChange('computer')}
          />
          Play vs Computer
        </label>
      </div>

      {mode === 'computer' && (
        <div className='difficulty-selection'>
          <label>
            <input
              type='radio'
              name='difficulty'
              checked={difficulty === 'easy'}
              onChange={() => handleDifficultyChange('easy')}
            />
            Easy
          </label>

          <label>
            <input
              type='radio'
              name='difficulty'
              checked={difficulty === 'hard'}
              onChange={() => handleDifficultyChange('hard')}
            />
            Hard
          </label>
        </div>
      )}

      <div className='status'>{status}</div>
      <Board board={board} onClick={handleBoxClick} />
      <ResetButton resetBoard={resetBoard} resetAll={resetAll} />
    </>
  );
}

export default App;
