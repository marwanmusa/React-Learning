import { useState } from 'react';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningLine: [a, b, c] };
    }
  }
  return { winner: null, winningLine: [] };
}

function Square({ value, onSquareClick, isWinningSquare }) {
  return <button
          className={`square ${isWinningSquare ? "highlight" : ""}`}
          onClick={onSquareClick}
         >
          {value}
         </button>;
}

function Board({ xIsNext, squares, onPlay }) {
  let status;
  const { winner, winningLine } = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);

  function handleClick(i) {
    if (winner || squares[i]) return;
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares, i);
  }


  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? "X" : "O"}`;
  }
  console.log(winningLine);

  return (
    <>
      <div className="status">{status}</div>
        {
          Array(3).fill(null).map((_, row) => (
            <div key={row} className="board-row">
              {
                Array(3).fill(null).map((_, col) => {
                  const idx = row * 3 + col;
                  return (
                      <Square
                        key={idx}
                        value={squares[idx]}
                        onSquareClick={() => handleClick(idx)}
                        isWinningSquare={winningLine.includes(idx)}
                      />
                    );
                  }
                )
              }
            </div>
          ))
        }
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), lastMove: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);

  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, lastMove) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, lastMove }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleOrder() {
    setIsAscending(!isAscending);
  }


  let  moves = history.map((entry, move) => {
    const { lastMove } = entry;
    const row = lastMove !== null ? Math.floor(lastMove / 3) : null;
    const col = lastMove !== null ? lastMove % 3 : null;

    const description =
    move === 0
      ? "Go to game start"
      : `Go to move #${move} (${row + 1}, ${col + 1})`; // 1-based index for display

    return (
      <li key={move}>
        {move === currentMove ? (
          move === 0 ? (
            <span>Game start</span>
          ) : (
            <span>You are at move #{move} ({row + 1}, {col + 1})</span>
          )
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  const sortedMoves = isAscending ? moves : moves.slice().reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleOrder}>
          {isAscending ? "Sort Descending" : "Sort Ascending"}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  );
}