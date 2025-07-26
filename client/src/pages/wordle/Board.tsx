import React, { useState, useCallback, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import { boardTestIds } from "./Board.testIds";
import "./Board.scss";

export type TileState = 'empty' | 'filled' | 'submitted';
export type TileStatus = 'correct' | 'present' | 'absent' | 'empty';

export interface Tile {
  letter: string;
  state: TileState;
  status: TileStatus;
}

interface BoardProps {
  guesses: string[];
  currentGuess: string;
  currentRow: number;
  maxGuesses: number;
  wordLength: number;
  tileStatuses: TileStatus[][];
  onTileClick?: (row: number, col: number) => void;
  isAnimating: boolean;
  invalidGuess: boolean;
  showCorrectGuess: boolean;
}

const Board: React.FC<BoardProps> = ({
  guesses,
  currentGuess,
  currentRow,
  maxGuesses = 6,
  wordLength = 5,
  tileStatuses,
  onTileClick,
  isAnimating,
  invalidGuess,
  showCorrectGuess
}) => {
  const [revealAnimations, setRevealAnimations] = useState<boolean[][]>([]);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [bounceRow, setBounceRow] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  // Initialize reveal animations array
  useEffect(() => {
    const animations = Array(maxGuesses).fill(null).map(() => Array(wordLength).fill(false));
    setRevealAnimations(animations);
  }, [maxGuesses, wordLength]);

  // Handle invalid guess shake animation
  useEffect(() => {
    if (invalidGuess && currentRow >= 0) {
      setShakeRow(currentRow);
      const timer = setTimeout(() => setShakeRow(null), 600);
      return () => clearTimeout(timer);
    }
  }, [invalidGuess, currentRow]);

  // Handle correct guess bounce animation
  useEffect(() => {
    if (showCorrectGuess && currentRow >= 0) {
      setBounceRow(currentRow);
      const timer = setTimeout(() => setBounceRow(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [showCorrectGuess, currentRow]);

  // Handle tile reveal animations for submitted guesses
  useEffect(() => {
    if (isAnimating && currentRow > 0) {
      const rowToAnimate = currentRow - 1;
      
      // Trigger reveal animations with staggered delays
      for (let col = 0; col < wordLength; col++) {
        setTimeout(() => {
          setRevealAnimations(prev => {
            const newAnimations = [...prev];
            if (newAnimations[rowToAnimate]) {
              newAnimations[rowToAnimate][col] = true;
            }
            return newAnimations;
          });
        }, col * 100); // Stagger by 100ms per tile
      }
    }
  }, [isAnimating, currentRow, wordLength]);

  const getTileContent = (row: number, col: number): string => {
    if (row < guesses.length) {
      return guesses[row][col] || '';
    } else if (row === currentRow && col < currentGuess.length) {
      return currentGuess[col] || '';
    }
    return '';
  };

  const getTileState = (row: number, col: number): TileState => {
    if (row < guesses.length) {
      return 'submitted';
    } else if (row === currentRow && col < currentGuess.length) {
      return 'filled';
    }
    return 'empty';
  };

  const getTileStatus = (row: number, col: number): TileStatus => {
    if (row < tileStatuses.length && tileStatuses[row] && col < tileStatuses[row].length) {
      return tileStatuses[row][col];
    }
    return 'empty';
  };

  const handleTileClick = useCallback((row: number, col: number) => {
    if (onTileClick && !isAnimating) {
      onTileClick(row, col);
    }
  }, [onTileClick, isAnimating]);

  const renderTile = (row: number, col: number) => {
    const letter = getTileContent(row, col);
    const state = getTileState(row, col);
    const status = getTileStatus(row, col);
    const isRevealing = revealAnimations[row] && revealAnimations[row][col];
    const isCurrentTile = row === currentRow && col === currentGuess.length;

    const tileClasses = [
      'board-tile',
      `tile-${state}`,
      `tile-${status}`,
      isRevealing ? 'revealing' : '',
      isCurrentTile ? 'current' : '',
      shakeRow === row ? 'shake' : '',
      bounceRow === row ? 'bounce' : ''
    ].filter(Boolean).join(' ');

    return (
      <div
        key={`${row}-${col}`}
        className={tileClasses}
        onClick={() => handleTileClick(row, col)}
        data-testid={`${boardTestIds.tile}-${row}-${col}`}
        style={{ animationDelay: `${col * 100}ms` }}
      >
        <span 
          className="tile-letter"
          data-testid={`${boardTestIds.letter}-${row}-${col}`}
        >
          {letter.toUpperCase()}
        </span>
      </div>
    );
  };

  const renderRow = (row: number) => {
    return (
      <div
        key={row}
        className="board-row"
        data-testid={`${boardTestIds.row}-${row}`}
      >
        {Array.from({ length: wordLength }, (_, col) => renderTile(row, col))}
      </div>
    );
  };

  return (
    <Container 
      className="board-container" 
      data-testid={boardTestIds.container}
      ref={boardRef}
    >
      <div 
        className="board-grid"
        data-testid={boardTestIds.grid}
      >
        {Array.from({ length: maxGuesses }, (_, row) => renderRow(row))}
      </div>
    </Container>
  );
};

export default Board;
