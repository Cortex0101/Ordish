import React from "react";
import {
    Col,
  Container,
  Row
} from "react-bootstrap";

// import { useTranslation } from "react-i18next"; // TODO: Import when implementing game content
import "./SpellingBee.scss"; // Assuming you have a SpellingBee.scss for styles

/*
        <Col className="game-container" xs={12} md={6}>
          W
        </Col>

        <Col className="progress-box" md={6}>
          t
        </Col>
        <Col className="wordlist-box" md={6}>
          x
        </Col>
*/


const SpellingBee: React.FC = () => {
  // const { t } = useTranslation("spellingBee"); // TODO: Use when implementing game content

  return (
    <Container fluid className="spelling-bee-container">
      {/* Mobile Layout: Stack vertically */}
      <div className="d-md-none">
        <Row className="mb-3">
          <Col xs={12} className="progress-box mobile-progress">
            Progress Box - 100% width, 20% height on mobile
          </Col>
        </Row>
        <Row className="mb-3">
          <Col xs={12} className="wordlist-box mobile-wordlist">
            Word List - 100% width, 20% height on mobile
          </Col>
        </Row>
        <Row>
          <Col xs={12} className="game-container mobile-game">
            Game Container - 100% width, 60% height on mobile
          </Col>
        </Row>
      </div>

      {/* Desktop Layout: Game left, Progress/Wordlist right */}
      <Row className="d-none d-md-flex spelling-bee-desktop">
        {/* Game Container - Left 50% */}
        <Col md={6} className="game-container desktop-game">
          Game Container - 50% width, 100% height on desktop
        </Col>
        
        {/* Right side - Progress and Wordlist */}
        <Col md={6} className="right-panel">
          <Row className="h-100">
            {/* Progress Box - Top 20% of right side */}
            <Col xs={12} className="progress-box desktop-progress">
              Progress Box - 50% width, 20% height on desktop
            </Col>
            {/* Word List - Bottom 80% of right side */}
            <Col xs={12} className="wordlist-box desktop-wordlist">
              Word List - 50% width, 80% height on desktop
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default SpellingBee;