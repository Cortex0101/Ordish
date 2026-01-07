import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
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

interface ProgressBarModalProps {
  show: boolean;
  onHide: () => void;
  currentScore: number;
  maxScore: number;
  rankLevels: RankLevel[];
  currentRank: string;
}

const ProgressBarModal: React.FC<ProgressBarModalProps> = ({ 
  show, 
  onHide, 
  currentScore, 
  maxScore, 
  rankLevels, 
  currentRank 
}) => {
  const { t } = useTranslation("spellingBee");

  // Calculate progress percentage for the current score
  const progressPercentage = (currentScore / maxScore) * 100;
  
  // Find current rank index
  const currentRankIndex = rankLevels.findIndex(level => 
    progressPercentage >= level.threshold
  );
  
  // Find next rank
  const nextRankIndex = Math.min(currentRankIndex + 1, rankLevels.length - 1);
  const nextRank = rankLevels[nextRankIndex];
  const geniusRank = rankLevels[rankLevels.length - 1];
  
  // Calculate points to next rank and to genius
  const pointsToNextRank = nextRankIndex < rankLevels.length - 1 
    ? Math.ceil((nextRank.threshold / 100) * maxScore) - currentScore
    : 0;
  const pointsToGenius = Math.ceil((geniusRank.threshold / 100) * maxScore) - currentScore;

  // Convert rank levels to scores for display
  const rankWithScores = rankLevels.map(rank => ({
    ...rank,
    minScore: Math.ceil((rank.threshold / 100) * maxScore)
  })).reverse(); // Show highest rank first

  return (
    <Modal show={show} onHide={onHide} fullscreen="sm-down">
      <Modal.Header closeButton>
        <Modal.Title>{t("modal-title")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t("modal-description")}
        <table className="sb-modal-ranks__list">
          <thead>
            <tr className="sb-modal-ranks__col-headers">
              <th className="sb-modal-ranks__rank-marker"></th>
              <th className="sb-modal-ranks__rank-title">{t("modal-rank-header")}</th>
              <th className="sb-modal-ranks__spacer"></th>
              <th className="sb-modal-ranks__rank-points">{t("modal-minimum-score-header")}</th>
            </tr>
          </thead>
          <tbody>
            {rankWithScores.map((rank, index) => {
              const isCurrentRank = rank.name === currentRank;
              const isAchieved = currentScore >= rank.minScore;
              const isLastRank = index === rankWithScores.length - 1;
              const isFirstRank = index === 0;
              
              return (
                <tr 
                  key={rank.name}
                  className={`${isCurrentRank ? 'sb-modal-ranks__current' : ''} ${isAchieved && !isCurrentRank ? 'sb-modal-ranks__achieved' : ''}`}
                >
                  <td className="sb-modal-ranks__rank-marker">
                    {isFirstRank ? (
                      <div className="square"></div>
                    ) : (
                      <div className={`dot ${isAchieved ? 'achieved' : ''}`}></div>
                    )}
                    {!isLastRank && (
                      <div className={`line ${isAchieved ? 'achieved' : ''} ${isFirstRank ? 'top' : ''} ${isLastRank ? 'bottom' : ''}`}></div>
                    )}
                    {isCurrentRank && (
                      <span className="current-score">{currentScore}</span>
                    )}
                  </td>
                  <td className="sb-modal-ranks__rank-title">
                    {isCurrentRank ? (
                      <>
                        <span className="current-rank">
                          {rank.name}<div className="rank-icon"></div>
                        </span>
                        <span className="sub-text points">
                          {pointsToNextRank > 0 
                            ? t("modal-points-to-next", { points: pointsToNextRank, nextRank: nextRank.name })
                            : t("modal-max-rank-achieved")
                          }
                          {pointsToGenius > 0 && `, ${t("modal-points-to-genius", { points: pointsToGenius })}`}
                        </span>
                      </>
                    ) : (
                      rank.name
                    )}
                  </td>
                  <td className={`sb-modal-ranks__spacer ${isCurrentRank ? '' : 'hr'}`}></td>
                  <td className="sb-modal-ranks__rank-points">{rank.minScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentScore = 3,
  maxScore = 120,
  onRankClick,
}) => {
  const { t } = useTranslation("spellingBee");

  const RANK_LEVELS: RankLevel[] = [
    { name: t("rank-lebel-beginer"), threshold: 0 }, // Beginner
    { name: t("rank-lebel-good-start"), threshold: 2 },
    { name: t("rank-lebel-moving-up"), threshold: 5 },
    { name: t("rank-lebel-good"), threshold: 10 },
    { name: t("rank-lebel-solid"), threshold: 15 },
    { name: t("rank-lebel-nice"), threshold: 20 },
    { name: t("rank-lebel-great"), threshold: 30 },
    { name: t("rank-lebel-amazing"), threshold: 50 },
    { name: t("rank-lebel-queen-bee"), threshold: 100 }, // Queen Bee
  ];

  const LEFT_PERCENTAGES = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];

  const [animateRank, setAnimateRank] = useState(false);
  const [previousRank, setPreviousRank] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    const completedDots = RANK_LEVELS.slice().filter(
      (level) => percentage >= level.threshold
    ).length;
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
      onClick={() => {
        setShowModal(!showModal);
        handleProgressClick();
      }}
    >
      {/* fullscreen modal on small screens */}
      <ProgressBarModal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        currentScore={currentScore}
        maxScore={maxScore}
        rankLevels={RANK_LEVELS}
        currentRank={currentRank}
      />

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
