import React, { useCallback, useRef, useState } from "react";
import { produce } from "immer";

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const getRandomGrid = (numRows, numCols) => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(
      Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
    );
  }
  return rows;
};

const emptyGrid = (numRows, numCols) =>
  Array.from({ length: numRows }, () => Array(numCols).fill(0));

const Home = () => {
  const [numRows, setNumRows] = useState(10);
  const [numCols, setNumCols] = useState(10);
  const [grid, setGrid] = useState(() => emptyGrid(numRows, numCols));
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const handleRowsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 10) {
      setNumRows(value);
    }
  };

  const handleColsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 10) {
      setNumCols(value);
    }
  };

  const handleGenerateGrid = () => {
    setGrid(() => getRandomGrid(numRows, numCols));
  };

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (
                newI >= 0 &&
                newI < numRows &&
                newK >= 0 &&
                newK < numCols
              ) {
                neighbours += g[newI][newK];
              }
            });

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbours === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 150);
  }, [setGrid, runningRef, numRows, numCols]);

  const handleRandom = () => {
    const randomGrid = getRandomGrid(numRows, numCols);
    setGrid(randomGrid);
  };

  const handleClear = () => {
    setRunning(false);
    const clearGrid = emptyGrid(numRows, numCols);
    setGrid(clearGrid);

    if (runningRef.current) {
      setRunning(false);
      runningRef.current = false;
      runSimulation();
    }
  };

  return (
    <>
    <h1>Game of Life</h1>
      <div>
        Rows:
        <input type="number" value={numRows} onChange={handleRowsChange} />
        Columns:
        <input type="number" value={numCols} onChange={handleColsChange} />
        <button onClick={handleGenerateGrid}>Generate Grid</button>
      </div>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      <button onClick={handleRandom}>Random</button>
      <button onClick={handleClear}>Clear</button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols},20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : undefined,
                border: "solid 1px black",
              }}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              key={`${i}-${k}`}
            ></div>
          ))
        )}
      </div>
    </>
  );
};

export default Home;
