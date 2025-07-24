import React, { useState, useCallback } from "react";

import { Container, Row, Col } from "react-bootstrap";

import "./Board.scss";

interface BoardProps {
  guesses: string[];
  currentGuess: number;
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
        <div className="board-rows">
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div key={rowIndex} className="board-row">
              {guesses[rowIndex] !== '*' ? (
                guesses[rowIndex].split("").map((letter, index) => (
                  <div
                    key={index}
                    className={`letter ${letterStatuses[letter] || "unused"}`}
                  >
                    {letter.toUpperCase()}
                  </div>
                ))
              ) : (
                <div className="letter empty"></div>
              )}
            </div>
          ))}

        {/* 
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

        */}
      </div>
    </div>
    </div>
  );
};

export default Board;
