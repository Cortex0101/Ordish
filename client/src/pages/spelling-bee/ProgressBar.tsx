import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentScore = 3,
  maxScore = 120,
  onRankClick,
}) => {
  const { t } = useTranslation("spellingBee");

  const RANK_LEVELS: RankLevel[] = [
    { name: t('rank-lebel-beginer'), threshold: 0 }, // Beginner
    { name: t('rank-lebel-good-start'), threshold: 2 },
    { name: t('rank-lebel-moving-up'), threshold: 5 },
    { name: t('rank-lebel-good'), threshold: 10 },
    { name: t('rank-lebel-solid'), threshold: 15 },
    { name: t('rank-lebel-nice'), threshold: 20 },
    { name: t('rank-lebel-great'), threshold: 30 },
    { name: t('rank-lebel-amazing'), threshold: 50 },
    { name: t('rank-lebel-queen-bee'), threshold: 100 }, // Queen Bee
  ];

  const LEFT_PERCENTAGES = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];

  const [animateRank, setAnimateRank] = useState(false);
  const [previousRank, setPreviousRank] = useState("");

  // Calculate current progress percentage
  const progressPercentage = Math.min((currentScore / maxScore) * 100, 100);

  // Determine current rank
  const getCurrentRank = (score: number): string => {
    const percentage = (score / maxScore) * 100;
    const rank = RANK_LEVELS.slice()
      .reverse()
      .find((level) => percentage >= level.threshold);
    return rank?.name || t("rank-lebel-beginer");
  };

  const getCompletedDots = (score: number): number => {
    const percentage = (score / maxScore) * 100;
    // Calculate the number of completed dots based on the rank levels
    const completedDots = RANK_LEVELS.slice()
      .filter((level) => percentage >= level.threshold).length;
    return Math.min(completedDots - 1, 9); // Limit to 8 dots (9
  };

  const currentRank = getCurrentRank(currentScore);
  const completedDots = getCompletedDots(currentScore);

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
        className={`sb-progress-rank ${animateRank ? "rank-animation" : ""}`}
        data-testid="sb-progress-rank"
      >
        <div className="rank-letter-container">
          {animateRank && <span className="outgoing">{previousRank}</span>}
          <span className={animateRank ? "incoming-letter" : ""}>
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
                className={`sb-progress-dot ${
                  index < completedDots ? "completed" : ""
                }`}
              />
            ))}
          </div>
        </div>

        <div
          className={`sb-progress-marker ${
            progressPercentage >= 100 ? "final" : ""
          }`}
          style={{ left: `${LEFT_PERCENTAGES[Math.min(completedDots, 8)]}%` }}
        >
          <span className="sb-progress-value">{currentScore}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
