import React, { useState, useCallback } from "react";

import { Stack, Button } from "react-bootstrap";
import { Shuffle } from "react-bootstrap-icons"; // Importing reshuffle icon

import "./Hive.scss"; // Assuming you have a Hive.scss for styles

const Hive: React.FC = () => {
  const [letters, setLetters] = useState<string[]>([
    "b",
    "c",
    "e",
    "h",
    "i",
    "o",
    "r",
    // first letter is the center cell
  ]);
  const [currentWord, setCurrentWord] = useState<string>("");

  const shuffleLetters = (arr: string[]) => {
    // shuffle letters, except the first one
    arr.splice(1, arr.length - 1, ...arr.slice(1).sort(() => Math.random() - 0.5));
    return arr;
  };

  const onShuffle = () => {
    const hiveElement = document.querySelector(".hive");
    if (!hiveElement) return;

    // Start fade-out animation
    hiveElement.classList.add("fade-out");
    
    // Listen for the fade-out transition to complete
    const handleFadeOutEnd = (event: Event) => {
      const transitionEvent = event as TransitionEvent;
      if (transitionEvent.propertyName === 'opacity') {
        hiveElement.removeEventListener('transitionend', handleFadeOutEnd);
        
        // Add shuffling class (letters are hidden)
        hiveElement.classList.remove('fade-out');
        hiveElement.classList.add('shuffling');
        
        // Shuffle the letters
        const shuffled = shuffleLetters([...letters]);
        setLetters(shuffled);
        
        // Start fade-in animation
        hiveElement.classList.remove('shuffling');
        hiveElement.classList.add('fade-in');
        
        // Listen for fade-in to complete
        const handleFadeInEnd = (event: Event) => {
          const transitionEvent = event as TransitionEvent;
          if (transitionEvent.propertyName === 'opacity') {
            hiveElement.removeEventListener('transitionend', handleFadeInEnd);
            hiveElement.classList.remove('fade-in');
          }
        };
        
        hiveElement.addEventListener('transitionend', handleFadeInEnd);
      }
    };
    
    hiveElement.addEventListener('transitionend', handleFadeOutEnd);
  };

  const [pressedCell, setPressedCell] = useState<string | null>(null);
  const [touchStarted, setTouchStarted] = useState<boolean>(false);

  const handleCellMouseDown = (letter: string, event: React.MouseEvent) => {
    // Prevent mouse events if touch was already used
    if (touchStarted) {
      event.preventDefault();
      return;
    }
    setPressedCell(letter);
  };

  const handleCellMouseUp = (letter: string, event: React.MouseEvent) => {
    // Prevent mouse events if touch was already used
    if (touchStarted) {
      event.preventDefault();
      return;
    }
    setPressedCell(null);
    // Only add letter if we were pressing this specific cell
    if (pressedCell === letter) {
      onCellClick(letter);
    }
  };

  const handleCellMouseLeave = () => {
    if (!touchStarted) {
      setPressedCell(null);
    }
  };

  const handleCellTouchStart = (letter: string, event: React.TouchEvent) => {
    event.preventDefault(); // Prevent mouse events from firing
    setTouchStarted(true);
    setPressedCell(letter);
  };

  const handleCellTouchEnd = (letter: string, event: React.TouchEvent) => {
    event.preventDefault(); // Prevent mouse events from firing
    setPressedCell(null);
    // Only add letter if we were pressing this specific cell
    if (pressedCell === letter) {
      onCellClick(letter);
    }
    // Reset touch flag after a short delay to allow for mouse events on desktop
    setTimeout(() => setTouchStarted(false), 100);
  };

  const handleCellTouchCancel = () => {
    setPressedCell(null);
    setTimeout(() => setTouchStarted(false), 100);
  };

  const onCellClick = useCallback((letter: string) => {
    if (letter) {
      const newWord = currentWord + letter.toLowerCase();
      setCurrentWord(newWord);
      console.log(`Letter clicked: ${letter} - Current word: ${newWord}`);
    }
  }, [currentWord]);

  const handleDelete = () => {
    if (currentWord.length > 0) {
      const newWord = currentWord.slice(0, -1);
      setCurrentWord(newWord);
      console.log(`Deleted last letter - Current word: ${newWord}`);
    }
  };

  const handleSubmit = () => {
    if (currentWord.trim()) {
      console.log(`Submitted word: ${currentWord}`);
      // Optionally clear the word after submission
      // setCurrentWord("");
    } else {
      console.log("No word to submit");
    }
  };

  return (
    <Stack className="hive-stack align-items-center">
      {/* Input field for user to type words */}
      <input
        type="text"
        className="hive-input"
        placeholder="Type a word..."
        id="hive-input"
        value={currentWord}
        readOnly
      ></input>

      {/* Game content would go here */}
      <div className="hive">
        {/* Placeholder for game content */}
        <svg
          className="hive-cell center"
          viewBox="0 0 120 103.92304845413263"
          data-testid="hive-cell-center"
          key="hive-cell-center"
          onMouseDown={(e) => handleCellMouseDown(letters[0], e)}
          onMouseUp={(e) => handleCellMouseUp(letters[0], e)}
          onMouseLeave={handleCellMouseLeave}
          onTouchStart={(e) => handleCellTouchStart(letters[0], e)}
          onTouchEnd={(e) => handleCellTouchEnd(letters[0], e)}
          onTouchCancel={handleCellTouchCancel}
        >
          <polygon
            className={`cell-fill ${pressedCell === letters[0] ? 'push-active' : ''}`}
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
            {letters[0]}
          </text>
        </svg>
        {
          // Render additional cells for the hive
          letters.slice(1).map((letter, index) => (
            <svg
              key={`outer-cell-${index}`}
              className="hive-cell outer"
              viewBox="0 0 120 103.92304845413263"
              data-testid="hive-cell-outer"
              onMouseDown={(e) => handleCellMouseDown(letter, e)}
              onMouseUp={(e) => handleCellMouseUp(letter, e)}
              onMouseLeave={handleCellMouseLeave}
              onTouchStart={(e) => handleCellTouchStart(letter, e)}
              onTouchEnd={(e) => handleCellTouchEnd(letter, e)}
              onTouchCancel={handleCellTouchCancel}
            >
              <polygon
                className={`cell-fill ${pressedCell === letter ? 'push-active' : ''}`}
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
                {letter}
              </text>
            </svg>
          ))
        }
      </div>

      <div className="hive-actions">
        {/* Delete button, shuffle (icon button), and submit word button */}
        <Button
          variant="outline-danger"
          className="hive-action"
          data-testid="delete-button"
          onClick={handleDelete}
        >
          Delete
        </Button>
        <Button
          variant="outline-secondary"
          className="hive-action"
          data-testid="shuffle-button"
          onClick={() => onShuffle()}
        >
          <Shuffle size={20} />
        </Button>
        <Button
          variant="primary"
          className="hive-action"
          data-testid="submit-word-button"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </Stack>
  );
};

export default Hive;
