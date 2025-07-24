import React, { useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Keyboard, { type LetterStatus } from "./Keyboard";
import Board from "./Board";

import "./Wordle.scss"; // Assuming you have a Wordle.scss for styles

const Wordle: React.FC = () => {
  const [currentGuess, setCurrentGuess] = useState<number>(0); // Initialize current guess as an empty string
  const [guesses, setGuesses] = useState<string[]>([
    '*****',
    '*****',
    '*****',
    '*****',
    '*****',
    '*****',
  ]);
  const [letterStatuses, setLetterStatuses] = useState<
    Record<string, LetterStatus>
  >({});
  const [gameStatus] = useState<"playing" | "won" | "lost">("playing");

  // TODO: Implement game status logic (win/loss conditions)

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== "playing") return;
      if (guesses[currentGuess].length >= 5) return;

      setGuesses((prev) => {
        const newGuess = prev[currentGuess] + key.toLowerCase();
        const updatedGuesses = [...prev];
        updatedGuesses[currentGuess] = newGuess;
        return updatedGuesses;
      });
    },
    [currentGuess, gameStatus, guesses]
  );

  const handleEnter = useCallback(() => {
    if (gameStatus !== "playing") return;
    if (guesses[currentGuess].length !== 5) return;

    // Here you would implement the game logic:
    // 1. Check if the word is valid
    // 2. Compare with the target word
    // 3. Update letter statuses
    // 4. Add to guesses
    // 5. Check for win/loss conditions

    setGuesses((prev) => [...prev, guesses[currentGuess]]);
    setCurrentGuess(0);

    // Mock letter status update - replace with actual game logic
    const newStatuses = { ...letterStatuses };
    for (const letter of guesses[currentGuess]) {
      if (!newStatuses[letter]) {
        // This is a simplified example - implement actual word comparison logic
        newStatuses[letter] = "absent"; // or 'present' or 'correct'
      }
    }
    setLetterStatuses(newStatuses);
  }, [currentGuess, gameStatus, guesses, letterStatuses]);

  const handleBackspace = useCallback(() => {
    if (gameStatus !== "playing") return;

    setCurrentGuess((prev) => prev - 1);
  }, [gameStatus]);

  return (
    <div className="wordle-container">
      <Board
        guesses={guesses}
        currentGuess={currentGuess}
        letterStatuses={letterStatuses}
        gameStatus={gameStatus}
      />

      {/* Keyboard */}
      <Keyboard
        onKeyPress={handleKeyPress}
        onEnter={handleEnter}
        onBackspace={handleBackspace}
        letterStatuses={letterStatuses}
        disabled={gameStatus !== "playing"}
      />
    </div>
  );
};

export default Wordle;
