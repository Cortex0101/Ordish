import React, { useState } from "react";
import { Container, Stack } from "react-bootstrap";

// import { useTranslation } from "react-i18next"; // TODO: Import when implementing game content
import "./SpellingBee.scss"; // Assuming you have a SpellingBee.scss for styles

import ProgressBar from "./ProgressBar";
import WordList from "./WordList";

const SpellingBee: React.FC = () => {
  // const { t } = useTranslation("spellingBee"); // TODO: Use when implementing game content
  const [currentScore, setCurrentScore] = useState(0);

  // Demo words for testing - would come from game state in real implementation
  const demoWords = [
    "cat",
    "dog",
    "bird",
    "fish",
    "mouse",
    "table",
    "chair",
    "house",
    "phone",
    "water",
    "elephant",
    "computer",
    "keyboard",
    "monitor",
    "printer",
    "beautiful",
    "wonderful",
    "fantastic",
    "incredible",
    "amazing",
  ];

  // Show more words as score increases (for demo purposes)
  const wordsToShow = demoWords.slice(0, Math.floor(currentScore / 6) + 1);

  const handleScoreChange = () => {
    // Demo: cycle through different scores to show progression
    const scores = [
      0, 2, 5, 9, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120,
    ];
    const currentIndex = scores.indexOf(currentScore);
    const nextIndex = (currentIndex + 1) % scores.length;
    setCurrentScore(scores[nextIndex]);
  };

  return (
    <Container className="spelling-bee-container">
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
          <WordList words={wordsToShow} maxScore={120} />
        </div>

        {/* Game Container */}
        <div className="game-container">
          <Stack className="hive-stack justify-content-center align-items-center">
            {/* Input field for user to type words */}
            <input
              type="text"
              className="hive-input"
              placeholder="Type a word..."
            ></input>

            {/* Game content would go here */}
            <div className="hive-content">
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
                  stroke-width="7.5"
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
                  stroke-width="7.5"
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
                  stroke-width="7.5"
                  data-testid="cell-fill"
                ></polygon>
                <text
                  className="cell-letter"
                  x="50%"
                  y="50%"
                  dy="0.35em"
                  data-testid="cell-letter"
                >
                  a
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
                  stroke-width="7.5"
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
              <svg
                className="hive-cell outer"
                viewBox="0 0 120 103.92304845413263"
                data-testid="hive-cell-outer"
              >
                <polygon
                  className="cell-fill"
                  points="0,51.96152422706631 30,0 90,0 120,51.96152422706631 90,103.92304845413263 30,103.92304845413263"
                  stroke="white"
                  stroke-width="7.5"
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
                  stroke-width="7.5"
                  data-testid="cell-fill"
                ></polygon>
                <text
                  className="cell-letter"
                  x="50%"
                  y="50%"
                  dy="0.35em"
                  data-testid="cell-letter"
                >
                  t
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
                  stroke-width="7.5"
                  data-testid="cell-fill"
                ></polygon>
                <text
                  className="cell-letter"
                  x="50%"
                  y="50%"
                  dy="0.35em"
                  data-testid="cell-letter"
                >
                  m
                </text>
              </svg>
            </div>

            <div className="hive-actions">
              <button
                className="hive-action-button"
                onClick={handleScoreChange}
              >
                Submit Word
              </button>
            </div>
          </Stack>
        </div>
      </div>
    </Container>
  );
};

export default SpellingBee;
