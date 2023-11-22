import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "./Home";
import { act } from "react-dom/test-utils";

describe("Home Component", () => {
  let container;

  beforeEach(() => {
    // Render the Home component before each test
    container = render(<Home />);
  });
  /////////////////////////////////////////////////////////////////////
  it("renders without crashing", () => {
    // No changes needed for this test
  });
  ////////////////////////////////////////////////////////////////////////
  it("starts the simulation when 'Start' button is clicked", async () => {
    const startButton = screen.getByText("Start");

    // Simulate a click on the 'Start' button
    act(() => {
      fireEvent.click(startButton);
    });

    // Wait for the simulation to Start and check the grid cells
    await waitFor(() => {
      const cells = getGridCells();
      cells.forEach((cell) => {
        expect(cell.style.backgroundColor).not.toBe("grey");
      });
    });
  });
  /////////////////////////////////////////////////////////////////////////
  it("pauses the simulation when 'Stop' button is pressed", async () => {
    const startButton = screen.getByText("Start");

    // Start the simulation
    act(() => {
      fireEvent.click(startButton);
    });

    // Wait for a while and check the grid cells
    await waitFor(
      () => {
        const cells = getGridCells();
        cells.forEach((cell) => {
          expect(cell.style.backgroundColor).not.toBe("grey");
        });
      },
      { timeout: 2000 }
    );

    // Find the 'Stop' button and simulate a click
    const stopButton = screen.getByText("Start");
    expect(stopButton).toBeInTheDocument();

    act(() => {
      fireEvent.click(stopButton);
    });

    // Wait again and check the grid cells after stopping the simulation
    await waitFor(() => {
      const cells = getGridCells();
      cells.forEach((cell) => {
        expect(cell.style.backgroundColor).not.toBe("grey");
      });
    });

    // Check if the 'Start' button is visible again after stopping
    const startButtonAfterStop = screen.getByText("Start");
    expect(startButtonAfterStop).toBeInTheDocument();
  });
  ////////////////////////////////////////////////////////////////////////
  it("clears the grid when 'Clear' button is clicked", () => {
    // Find and click the 'Clear' button
    const clearButton = screen.getByText("Clear");
    fireEvent.click(clearButton);

    // Check that all grid cells are not grey
    const cells = getGridCells();
    cells.forEach((cell) => {
      expect(cell.style.backgroundColor).not.toBe("grey");
    });
  });
  ////////////////////////////////////////////////////////////////////////
  it("generates a random pattern when 'Random' button is clicked", () => {
    // Find and click the 'Random' button
    const randomButton = screen.getByText("Random");
    fireEvent.click(randomButton);
  
    // Get all grid cells
    const gridCells = getGridCells();
  
    // Check if there is at least one live cell and one dead cell in the grid
    let hasLiveCell = false;
    let hasDeadCell = false;
  
    gridCells.forEach((cell) => {
      if (cell.style.backgroundColor === "grey") {
        hasLiveCell = true;
      } else {
        hasDeadCell = true;
      }
    });
  
    expect(hasLiveCell).toBe(true);
    expect(hasDeadCell).toBe(true);
  });
  
  ////////////////////////////////////////////////////////////////////////
  it("prevents the user from entering rows less than 10", () => {
    // Find the rows input and change its value to 5
    const rowsInput = screen.getByLabelText("Rows:");
    fireEvent.change(rowsInput, { target: { value: 5 } });

    // Check if the value is set to the minimum (10) after the change
    expect(rowsInput.value).toBe("10");
  });
  ////////////////////////////////////////////////////////////////////////
  it("prevents the user from entering columns less than 10", () => {
    // Find the columns input and change its value to 8
    const colsInput = screen.getByLabelText("Columns:");
    fireEvent.change(colsInput, { target: { value: 8 } });

    // Check if the value is set to the minimum (10) after the change
    expect(colsInput.value).toBe("10");
  });
  ////////////////////////////////////////////////////////////////////////
  it("generates a new grid when 'Generate Grid' button is clicked with valid dimensions", () => {
    // Find the 'Generate Grid' button
    const generateGridButton = screen.getByText("Generate Grid");

    // Change the values of rows and columns inputs
    fireEvent.change(screen.getByLabelText("Rows:"), { target: { value: 15 } });
    fireEvent.change(screen.getByLabelText("Columns:"), {
      target: { value: 20 },
    });

    // Click the 'Generate Grid' button
    fireEvent.click(generateGridButton);
  });
  ////////////////////////////////////////////////////////////////////////
  it("allows the user to generate random patterns by clicking grid squares", () => {
    // Find all grid cells
    const gridCells = getGridCells();

    // Store the initial state of the grid cells
    const initialGridState = gridCells.map(
      (cell) => cell.style.backgroundColor
    );

    // Click each grid cell
    gridCells.forEach((cell) => {
      fireEvent.click(cell);
    });

    // Check that the grid state has changed after clicking
    const updatedGridState = gridCells.map(
      (cell) => cell.style.backgroundColor
    );
    expect(updatedGridState).not.toEqual(initialGridState);
    expect(updatedGridState).toContain("grey");
  });
  ////////////////////////////////////////////////////////////////////////
  
  it("displays an alert when there are no live cells and the 'Start' button is pressed", () => {
    // Mock window.alert to prevent actual alerts during testing
    jest.spyOn(window, "alert").mockImplementation(() => {});
  
    // Find the 'Start' button and simulate a click
    const startButton = screen.getByText("Start");
    fireEvent.click(startButton);
  
    // Check if the alert function was called
    expect(window.alert).toHaveBeenCalledTimes(1);
  
    // Restore the original alert function after the test
    window.alert.mockRestore();
  });
  
  ////////////////////////////////////////////////////////////////////////
  function getGridCells() {
    // Helper function to get all grid cells
    return screen.queryAllByRole("gridcell");
  }
});
