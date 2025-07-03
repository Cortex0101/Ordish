import React, { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";

import "./ProgressBar.scss";

interface ProgressBarProps {
  currentScore?: number;
  maxScore?: number;
  onRankClick?: () => void;
}

interface RankLevel {
  name: string;
  threshold: number; // Percentage of max score needed
}

const RANK_LEVELS: RankLevel[] = [
  { name: "Beginner", threshold: 0 },
  { name: "Good Start", threshold: 2 },
  { name: "Moving Up", threshold: 5 },
  { name: "Good", threshold: 8 },
  { name: "Solid", threshold: 15 },
  { name: "Nice", threshold: 25 },
  { name: "Great", threshold: 40 },
  { name: "Amazing", threshold: 50 },
  { name: "Queen Bee", threshold: 100 }
];

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentScore = 3,
  maxScore = 120,
  onRankClick
}) => {
  // const { t } = useTranslation("spellingBee");
  
  const [animateRank, setAnimateRank] = useState(false);
  const [previousRank, setPreviousRank] = useState("");

  // Calculate current progress percentage
  const progressPercentage = Math.min((currentScore / maxScore) * 100, 100);
  
  // Determine current rank
  const getCurrentRank = (score: number): string => {
    const percentage = (score / maxScore) * 100;
    const rank = RANK_LEVELS.slice()
      .reverse()
      .find(level => percentage >= level.threshold);
    return rank?.name || "Beginner";
  };

  const currentRank = getCurrentRank(currentScore);
  const completedDots = Math.min(Math.floor(progressPercentage / 12.5), 8); // 8 dots total (9th is Queen Bee)

  // Animate rank changes
  useEffect(() => {
    if (previousRank && previousRank !== currentRank) {
      setAnimateRank(true);
      const timer = setTimeout(() => setAnimateRank(false), 1000);
      return () => clearTimeout(timer);
    }
    setPreviousRank(currentRank);
  }, [currentRank, previousRank]);

  const handleProgressClick = () => {
    if (onRankClick) {
      onRankClick();
    }
  };

  return (
    <div
      className="sb-progress"
      data-testid="sb-progress"
      title="Click to see today's ranks"
      onClick={handleProgressClick}
    >
      <h4 
        className={`sb-progress-rank ${animateRank ? 'rank-animation' : ''}`}
        data-testid="sb-progress-rank"
      >
        <div className="rank-letter-container">
          {animateRank && (
            <span className="outgoing">{previousRank}</span>
          )}
          <span className={animateRank ? 'incoming-letter' : ''}>
            {currentRank}
          </span>
        </div>
      </h4>
      
      <div className="sb-progress-bar">
        <div className="sb-progress-line">
          <div className="sb-progress-dots">
            {Array.from({ length: 9 }, (_, index) => (
              <span
                key={index}
                className={`sb-progress-dot ${index < completedDots ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
        
        <div 
          className={`sb-progress-marker ${progressPercentage >= 100 ? 'final' : ''}`}
          style={{ left: `${Math.min(progressPercentage, 100)}%` }}
        >
          <span className="sb-progress-value">{currentScore}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
