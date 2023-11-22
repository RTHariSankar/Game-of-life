import React, { useCallback, useRef, useState } from "react";
import { produce } from "immer";

// Define the possible operations to find neighbors
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

// Function to generate a random grid based on the given dimensions
const getRandomGrid = (numRows, numCols) => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

// Function to create an empty grid based on the given dimensions
const emptyGrid = (numRows, numCols) =>
  Array.from({ length: numRows }, () => Array(numCols).fill(0));

const Home = () => {
  // State variables
  // Rest of the code using cells

  const [numRows, setNumRows] = useState(10);
  const [numCols, setNumCols] = useState(10);
  const [grid, setGrid] = useState(() => emptyGrid(numRows, numCols));
  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  // Event handler for changing the number of rows
  const handleRowsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 10) {
      setNumRows(value);
      setGrid(emptyGrid(value, numCols)); // Clear the grid
      stopSimulation();
    }
  };

  // Event handler for changing the number of columns
  const handleColsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 10) {
      setNumCols(value);
      setGrid(emptyGrid(numRows, value)); // Clear the grid
      stopSimulation();
    }
  };

  // Function to stop the simulation
  const stopSimulation = () => {
    setRunning(false);
    runningRef.current = false;
  };

  // Event handler for generating a random grid
  const handleGenerateGrid = () => {
    stopSimulation();
    const newGrid = getRandomGrid(numRows, numCols);
    setGrid(newGrid);
  };

  // Memoized function for running the simulation
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      let hasLiveCell = false; // Track if there are live cells in the grid

      const newGrid = produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbours = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbours += g[newI][newK];
              }
            });

            if (neighbours < 2 || neighbours > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbours === 3) {
              gridCopy[i][k] = 1;
            }

            // Check if there is at least one live cell
            if (gridCopy[i][k] === 1) {
              hasLiveCell = true;
            }
          }
        }
      });

      // If there are no live cells, reset the buttons and stop the simulation
      if (!hasLiveCell) {
        stopSimulation();
        return emptyGrid(numRows, numCols);
      }

      return newGrid;
    });

    setTimeout(runSimulation, 150);
  }, [setGrid, runningRef, numRows, numCols]);

  // Event handler for toggling the running state
  const handleToggleRunning = () => {
    const hasLiveCell = grid.some((row) => row.includes(1));

    if (!hasLiveCell) {
      alert("Please generate a grid with at least one live cell.");
      return;
    }

    setRunning(!running);
    if (!running) {
      runningRef.current = true;
      runSimulation();
    }
  };

  // Event handler for generating a random grid
  const handleRandom = () => {
    const randomGrid = getRandomGrid(numRows, numCols);
    setGrid(randomGrid);
  };

  // Event handler for clearing the grid
  const handleClear = () => {
    stopSimulation();
    const clearGrid = emptyGrid(numRows, numCols);
    setGrid(clearGrid);
  };

  // Render the component
  return (
    <div className="container">
      <h1 className="mt-3 mb-5 text-center">Conway's Game of Life</h1>
      <div className="container text-center">
        <div className="container text-center">
          <div className="row">
            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 xol-xxl-4">
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Rows
                </span>
                <input
                  type="number"
                  className="form-control"
                  aria-label="Rows:"
                  value={numRows}
                  onChange={handleRowsChange}
                />
              </div>
            </div>
            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 xol-xxl-4">
              <div className="input-group mb-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Columns:
                </span>
                <input
                  type="number"
                  className="form-control"
                  aria-label="Columns:"
                  value={numCols}
                  onChange={handleColsChange}
                />
              </div>
            </div>
            <div className="col col-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 xol-xxl-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateGrid}
              >
                Generate Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3">
        <div className="d-grid d-md-block text-center">
          <button
            className="btn btn-primary me-2"
            type="button"
            onClick={handleToggleRunning}
          >
            {running ? "Stop" : "Start"}
          </button>
          <button
            className="btn btn-primary me-2"
            type="button"
            onClick={handleRandom}
          >
            Random
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>
      
      <div
      className="container mt-5 mb-5 justify-content-center"
        style={{
          display: grid.length ? "grid" : "none", // Show/hide grid based on its existence
          gridTemplateColumns: `repeat(${numCols},20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              role="gridcell"
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "grey" : undefined,
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
    </div>
  );
};

export default Home;
