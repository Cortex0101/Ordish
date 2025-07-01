import React from "react";
import {
  Container
} from "react-bootstrap";

import { useTranslation } from "react-i18next";
import "./SpellingBee.scss"; // Assuming you have a SpellingBee.scss for styles

const SpellingBee: React.FC = () => {
  const { t } = useTranslation("profile");

  return (
    <Container className="settings-container">
      <h2 className="h3 mb-4 page-title">{t("settings-title")}</h2>
      {/* Settings content will go here */}
      <p>{t("settings-description")}</p>
      {/* Add more settings components as needed */}
    </Container>
  );
};

export default SpellingBee;