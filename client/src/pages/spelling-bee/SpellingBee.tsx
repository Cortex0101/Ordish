import React, { useState } from "react";
import {
  Container
} from "react-bootstrap";

// import { useTranslation } from "react-i18next"; // TODO: Import when implementing game content
import "./SpellingBee.scss"; // Assuming you have a SpellingBee.scss for styles

import ProgressBar from "./ProgressBar";
import WordList from "./WordList";

const SpellingBee: React.FC = () => {
  // const { t } = useTranslation("spellingBee"); // TODO: Use when implementing game content
  const [currentScore, setCurrentScore] = useState(0);

  // Demo words for testing - would come from game state in real implementation
  const demoWords = [
    "cat", "dog", "bird", "fish", "mouse",
    "table", "chair", "house", "phone", "water",
    "elephant", "computer", "keyboard", "monitor", "printer",
    "beautiful", "wonderful", "fantastic", "incredible", "amazing"
  ];

  // Show more words as score increases (for demo purposes)
  const wordsToShow = demoWords.slice(0, Math.floor(currentScore / 6) + 1);

  const handleScoreChange = () => {
    // Demo: cycle through different scores to show progression
    const scores = [0, 2, 5, 9, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
    const currentIndex = scores.indexOf(currentScore);
    const nextIndex = (currentIndex + 1) % scores.length;
    setCurrentScore(scores[nextIndex]);
  };

  return (
    <Container fluid className="spelling-bee-container">
      <div className="spelling-bee-grid">
        {/* Progress Box */}
        <div className="progress-box">
          <ProgressBar 
            currentScore={currentScore}
            maxScore={120}
            onRankClick={handleScoreChange}
          />
        </div>
        
        {/* Word List */}
        <div className="wordlist-box">
          <WordList 
            words={wordsToShow}
            maxScore={120}
          />
        </div>
        
        {/* Game Container */}
        <div className="game-container">
          Game Container - Responsive positioning
          <br />
          <small>Current Score: {currentScore}/120</small>
        </div>
      </div>
    </Container>
  );
};

export default SpellingBee;