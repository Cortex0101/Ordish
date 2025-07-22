import React, { useState, useCallback } from "react";

import { Container, Row, Col } from "react-bootstrap";

import "./Board.scss";

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  letterStatuses: Record<string, "correct" | "present" | "absent" | "unused">;
  gameStatus: "playing" | "won" | "lost";
}

const Board: React.FC<BoardProps> = ({
  guesses,
  currentGuess,
  letterStatuses,
  gameStatus,
}) => {
  return (
    <div className="board-container">
      <div className="board">
        {/* Display guesses and current guess */}
        <div className="guesses">
          {guesses.map((guess, index) => (
            <div key={index} className="guess">
              {guess.toUpperCase()}
            </div>
          ))}
          {gameStatus === "playing" && (
            <div className="current-guess">
              {currentGuess.toUpperCase().padEnd(5, "_")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Board;
