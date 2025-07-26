import React, { useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Keyboard, { type LetterStatus } from "./Keyboard";
import Board, { type TileStatus } from "./Board";

import "./Wordle.scss"; // Assuming you have a Wordle.scss for styles

const Wordle: React.FC = () => {
  const [currentGuessString, setCurrentGuessString] = useState<string>(""); // Current guess as string
  const [currentRow, setCurrentRow] = useState<number>(0); // Current row index
  const [guesses, setGuesses] = useState<string[]>([]); // Completed guesses
  const [letterStatuses, setLetterStatuses] = useState<
    Record<string, LetterStatus>
  >({});
  const [tileStatuses, setTileStatuses] = useState<TileStatus[][]>([]); // 2D array for tile statuses
  const [gameStatus] = useState<"playing" | "won" | "lost">("playing");
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [invalidGuess, setInvalidGuess] = useState<boolean>(false);
  const [showCorrectGuess, setShowCorrectGuess] = useState<boolean>(false);

  // TODO: Implement game status logic (win/loss conditions)

  const handleKeyPress = useCallback(
    (key: string) => {
      if (gameStatus !== "playing") return;
      if (currentGuessString.length >= 5) return;

      setCurrentGuessString(prev => prev + key.toLowerCase());
    },
    [currentGuessString, gameStatus]
  );

  const handleEnter = useCallback(() => {
    if (gameStatus !== "playing") return;
    if (currentGuessString.length !== 5) return;

    setIsAnimating(true);

    // Here you would implement the game logic:
    // 1. Check if the word is valid
    // 2. Compare with the target word
    // 3. Update letter statuses
    // 4. Add to guesses
    // 5. Check for win/loss conditions

    // Add current guess to completed guesses
    setGuesses(prev => [...prev, currentGuessString]);
    
    // Create tile statuses for this guess (mock implementation)
    const newTileRow: TileStatus[] = currentGuessString.split('').map(() => 'absent' as TileStatus);
    setTileStatuses(prev => [...prev, newTileRow]);

    // Mock letter status update - replace with actual game logic
    const newStatuses = { ...letterStatuses };
    for (const letter of currentGuessString) {
      if (!newStatuses[letter]) {
        // This is a simplified example - implement actual word comparison logic
        newStatuses[letter] = "absent"; // or 'present' or 'correct'
      }
    }
    setLetterStatuses(newStatuses);

    // Reset current guess and move to next row
    setCurrentGuessString("");
    setCurrentRow(prev => prev + 1);
    
    // Stop animation after delay
    setTimeout(() => setIsAnimating(false), 500);
  }, [currentGuessString, gameStatus, letterStatuses]);

  const handleBackspace = useCallback(() => {
    if (gameStatus !== "playing") return;
    if (currentGuessString.length === 0) return;

    setCurrentGuessString(prev => prev.slice(0, -1));
  }, [gameStatus, currentGuessString]);

  return (
    <div className="wordle-container">
      <Board
        guesses={guesses}
        currentGuess={currentGuessString}
        currentRow={currentRow}
        maxGuesses={6}
        wordLength={5}
        tileStatuses={tileStatuses}
        isAnimating={isAnimating}
        invalidGuess={invalidGuess}
        showCorrectGuess={showCorrectGuess}
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
