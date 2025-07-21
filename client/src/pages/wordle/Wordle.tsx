import React, { useState, useCallback } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Keyboard, { type LetterStatus } from "./Keyboard";

import "./Wordle.scss"; // Assuming you have a Wordle.scss for styles

const Wordle: React.FC = () => {
    const [currentGuess, setCurrentGuess] = useState<string>('');
    const [guesses, setGuesses] = useState<string[]>([]);
    const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>({});
    const [gameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
    
    // TODO: Implement game status logic (win/loss conditions)

    const handleKeyPress = useCallback((key: string) => {
        if (gameStatus !== 'playing') return;
        if (currentGuess.length >= 5) return;
        
        setCurrentGuess(prev => prev + key.toLowerCase());
    }, [currentGuess, gameStatus]);

    const handleEnter = useCallback(() => {
        if (gameStatus !== 'playing') return;
        if (currentGuess.length !== 5) return;
        
        // Here you would implement the game logic:
        // 1. Check if the word is valid
        // 2. Compare with the target word
        // 3. Update letter statuses
        // 4. Add to guesses
        // 5. Check for win/loss conditions
        
        setGuesses(prev => [...prev, currentGuess]);
        setCurrentGuess('');
        
        // Mock letter status update - replace with actual game logic
        const newStatuses = { ...letterStatuses };
        for (const letter of currentGuess) {
            if (!newStatuses[letter]) {
                // This is a simplified example - implement actual word comparison logic
                newStatuses[letter] = 'absent'; // or 'present' or 'correct'
            }
        }
        setLetterStatuses(newStatuses);
    }, [currentGuess, gameStatus, letterStatuses]);

    const handleBackspace = useCallback(() => {
        if (gameStatus !== 'playing') return;
        
        setCurrentGuess(prev => prev.slice(0, -1));
    }, [gameStatus]);

    return (
        <div className="wordle-container">
            <Container>
                <Row>
                    <Col>
                        <h1>Wordle</h1>
                        
                        {/* Game Board would go here */}
                        <div className="game-board">
                            {/* Display guesses and current guess */}
                            <div className="guesses">
                                {guesses.map((guess, index) => (
                                    <div key={index} className="guess">
                                        {guess.toUpperCase()}
                                    </div>
                                ))}
                                {gameStatus === 'playing' && (
                                    <div className="current-guess">
                                        {currentGuess.toUpperCase().padEnd(5, '_')}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* Keyboard */}
                        <Keyboard
                            onKeyPress={handleKeyPress}
                            onEnter={handleEnter}
                            onBackspace={handleBackspace}
                            letterStatuses={letterStatuses}
                            disabled={gameStatus !== 'playing'}
                        />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Wordle;