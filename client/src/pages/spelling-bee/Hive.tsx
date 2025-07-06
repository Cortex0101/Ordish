import React, { useEffect } from "react";

import { Stack, Button } from "react-bootstrap";
import { Shuffle } from "react-bootstrap-icons"; // Importing reshuffle icon

import "./Hive.scss"; // Assuming you have a Hive.scss for styles

const Hive: React.FC = () => {
  useEffect(() => {
    // Add event listeners to each cell polygon
    const cells =
      document.querySelectorAll<SVGPolygonElement>(".hive-cell polygon");
    cells.forEach((cell) => {
      // Handle mouse events
      cell.addEventListener("mousedown", () => onCellPressStart(cell));
      cell.addEventListener("mouseup", () => onCellPressEnd(cell));
      cell.addEventListener("mouseleave", () => onCellPressEnd(cell)); // Also remove on mouse leave

      // Handle touch events for mobile
      cell.addEventListener("touchstart", () => onCellPressStart(cell), {
        passive: true,
      });
      cell.addEventListener("touchend", () => onCellPressEnd(cell), {
        passive: true,
      });
      cell.addEventListener("touchcancel", () => onCellPressEnd(cell), {
        passive: true,
      });

      // Handle click for actual letter selection
      cell.addEventListener("click", () =>
        onCellClick(cell, cell.getAttribute("data-testid") || "")
      );
    });
  }, []);

  const onCellPressStart = (cellElement: SVGPolygonElement) => {
    cellElement.classList.add("push-active");
  };

  const onCellPressEnd = (cellElement: SVGPolygonElement) => {
    cellElement.classList.remove("push-active");
  };

  const onCellClick = (cellElement: SVGPolygonElement, testId: string) => {
    // Handle the actual letter selection logic here
    const letter =
      cellElement.parentElement?.querySelector(".cell-letter")?.textContent;
    console.log(`Cell clicked: ${letter} (${testId})`);
  };

  return (
    <Stack className="hive-stack align-items-center">
      {/* Input field for user to type words */}
      <input
        type="text"
        className="hive-input"
        placeholder="Type a word..."
      ></input>

      {/* Game content would go here */}
      <div className="hive">
        {/* Placeholder for game content */}
        <svg
          className="hive-cell center"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-center"
        >
          <polygon
            className="cell-fill"
            points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
            stroke="white"
            strokeWidth="7.5"
            data-testid="cell-fill"
          ></polygon>
          <text
            className="cell-letter"
            x="50%"
            y="50%"
            dy="0.35em"
            data-testid="cell-letter"
          >
            b
          </text>
        </svg>
        <svg
          className="hive-cell outer"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-outer"
        >
          <polygon
            className="cell-fill"
            points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
            stroke="white"
            strokeWidth="7.5"
            data-testid="cell-fill"
          ></polygon>
          <text
            className="cell-letter"
            x="50%"
            y="50%"
            dy="0.35em"
            data-testid="cell-letter"
          >
            c
          </text>
        </svg>
        <svg
          className="hive-cell outer"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-outer"
        >
          <polygon
            className="cell-fill"
            points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
            stroke="white"
            strokeWidth="7.5"
            data-testid="cell-fill"
          ></polygon>
          <text
            className="cell-letter"
            x="50%"
            y="50%"
            dy="0.35em"
            data-testid="cell-letter"
          >
            e
          </text>
        </svg>
        <svg
          className="hive-cell outer"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-outer"
        >
          <polygon
            className="cell-fill"
            points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
            stroke="white"
            strokeWidth="7.5"
            data-testid="cell-fill"
          ></polygon>
          <text
            className="cell-letter"
            x="50%"
            y="50%"
            dy="0.35em"
            data-testid="cell-letter"
          >
            h
          </text>
        </svg>
        <svg
          className="hive-cell outer"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-outer"
        >
          <polygon
            className="cell-fill"
            points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
            stroke="white"
            strokeWidth="7.5"
            data-testid="cell-fill"
          ></polygon>
          <text
            className="cell-letter"
            x="50%"
            y="50%"
            dy="0.35em"
            data-testid="cell-letter"
          >
            i
          </text>
        </svg>
        <svg
          className="hive-cell outer"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-outer"
        >
          <polygon
            className="cell-fill"
            points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
            stroke="white"
            strokeWidth="7.5"
            data-testid="cell-fill"
          ></polygon>
          <text
            className="cell-letter"
            x="50%"
            y="50%"
            dy="0.35em"
            data-testid="cell-letter"
          >
            o
          </text>
        </svg>
        <svg
          className="hive-cell outer"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-outer"
        >
          <polygon
            className="cell-fill"
            points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
            stroke="white"
            strokeWidth="7.5"
            data-testid="cell-fill"
          ></polygon>
          <text
            className="cell-letter"
            x="50%"
            y="50%"
            dy="0.35em"
            data-testid="cell-letter"
          >
            r
          </text>
        </svg>
      </div>

      <div className="hive-actions">
        {/* Delete button, shuffle (icon button), and submit word button */}
        <Button
          variant="outline-danger"
          className="hive-action"
          data-testid="delete-button"
          onClick={() => console.log("Delete word")}
        >
          Delete
        </Button>
        <Button
          variant="outline-secondary"
          className="hive-action"
          data-testid="shuffle-button"
          onClick={() => console.log("Shuffle letters")}
        >
          <Shuffle size={20} />
        </Button>
        <Button
          variant="primary"
          className="hive-action"
          data-testid="submit-word-button"
          onClick={() => console.log("Submit word")}
        >
          Submit
        </Button>
      </div>
    </Stack>
  );
};

export default Hive;
