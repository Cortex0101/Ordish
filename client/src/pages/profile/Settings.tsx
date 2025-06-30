import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  ListGroup,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { settingsTestIds } from "./Settings.testIds";
import "./Settings.scss";

const Settings: React.FC = () => {
  const { t } = useTranslation("profile");
  const { user, preferences, updatePreferences } = useAuth();

  const handleThemeChange = async (theme: "light" | "dark" | "auto") => {
    if (preferences) {
      await updatePreferences({ ...preferences, theme });
    }
  };

  const handleLanguageChange = async (language: string) => {
    if (preferences) {
      await updatePreferences({ ...preferences, language });
    }
  };

  const handleEdit = (field: string) => {
    // TODO: Implement edit functionality
    console.log(`Edit ${field}`);
  };

  return (
    <Container
      data-testid={settingsTestIds.container}
      className="settings-container"
    >
      <Row className="justify-content-center">
        <Col xs={12} lg={10} xl={8} className="mx-auto">
          <h2
            className="h3 mb-4 page-title"
            data-testid={settingsTestIds.pageTitle}
          >
            {t("settings-title")}
          </h2>

          {/* Account Details Section */}
          <Card
            className="mb-4 shadow-sm"
            data-testid={settingsTestIds.accountSection}
          >
            <Card.Header>
              <h5 className="mb-1" data-testid={settingsTestIds.accountTitle}>
                {t("account-section-title")}
              </h5>
              <p
                className="text-muted mb-0 small"
                data-testid={settingsTestIds.accountDescription}
              >
                {t("account-section-description")}
              </p>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" as={"ul"}>
                {/* Username */}
                <ListGroup.Item
                  as="li"
                  className="d-flex align-items-center"
                  data-testid={settingsTestIds.usernameItem}
                >
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-bold" data-testid={settingsTestIds.usernameLabel}>
                      {t("username-label")}
                    </div>
                    <span data-testid={settingsTestIds.usernameValue}>
                      {user?.username || "Not set"}
                    </span>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    data-testid={settingsTestIds.usernameEditButton}
                    onClick={() => handleEdit("username")}
                  >
                    {t("edit-button")}
                  </Button>
                </ListGroup.Item>

                {/* Email */}
                <ListGroup.Item
                  as="li"
                  className="d-flex align-items-center"
                  data-testid={settingsTestIds.emailItem}
                >
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-bold" data-testid={settingsTestIds.emailLabel}>
                      {t("email-label")}
                    </div>
                    <span data-testid={settingsTestIds.emailValue}>
                      {user?.email || "Not set"}
                    </span>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    data-testid={settingsTestIds.emailEditButton}
                    onClick={() => handleEdit("email")}
                  >
                    {t("edit-button")}
                  </Button>
                </ListGroup.Item>

                {/* Password */}
                <ListGroup.Item
                  as="li"
                  className="d-flex align-items-center"
                  data-testid={settingsTestIds.passwordItem}
                >
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-bold" data-testid={settingsTestIds.passwordLabel}>
                      {t("password-label")}
                    </div>
                    <span data-testid={settingsTestIds.passwordValue}>
                      {t("password-value")}
                    </span>
                  </div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    data-testid={settingsTestIds.passwordChangeButton}
                    onClick={() => handleEdit("password")}
                  >
                    {t("change-button")}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          {/* Preferences Section */}
          <Card
            className="mb-4 shadow-sm"
            data-testid={settingsTestIds.preferencesSection}
          >
            <Card.Header>
              <h5
                className="mb-1"
                data-testid={settingsTestIds.preferencesTitle}
              >
                {t("preferences-section-title")}
              </h5>
              <p
                className="text-muted mb-0 small"
                data-testid={settingsTestIds.preferencesDescription}
              >
                {t("preferences-section-description")}
              </p>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" as="ul">
                {/* Theme Setting */}
                <ListGroup.Item
                  as="li"
                  className="d-flex align-items-center"
                  data-testid={settingsTestIds.themeItem}
                >
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-bold" data-testid={settingsTestIds.themeLabel}>
                      {t("theme-label")}
                    </div>
                    <small data-testid={settingsTestIds.themeDescription}>
                      {t("theme-description")}
                    </small>
                  </div>
                  <Form.Select
                    className="w-25"
                    size="sm"
                    value={preferences?.theme || "auto"}
                    onChange={(e) =>
                      handleThemeChange(
                        e.target.value as "light" | "dark" | "auto"
                      )
                    }
                    data-testid={settingsTestIds.themeSelect}
                  >
                    <option value="light">{t("theme-light")}</option>
                    <option value="dark">{t("theme-dark")}</option>
                    <option value="auto">{t("theme-auto")}</option>
                  </Form.Select>
                </ListGroup.Item>

                {/* Language Setting */}
                <ListGroup.Item
                  as="li"
                  className="d-flex align-items-center"
                  data-testid={settingsTestIds.languageItem}
                >
                  <div className="ms-2 me-auto text-muted">
                    <div className="fw-bold" data-testid={settingsTestIds.languageLabel}>
                      {t("language-label")}
                    </div>
                    <small data-testid={settingsTestIds.languageDescription}>
                      {t("language-description")}
                    </small>
                  </div>
                  <Form.Select
                    className="w-25"
                    size="sm"
                    value={preferences?.language || "en"}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    data-testid={settingsTestIds.languageSelect}
                  >
                    <option value="en">{t("language-english")}</option>
                    <option value="da">{t("language-danish")}</option>
                  </Form.Select>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Button 
          variant="danger" 
          className="w-100 mb-2"
          data-testid={settingsTestIds.deleteAccountButton}
          onClick={() => {console.log("Delete account")}}
            >
                {t("delete-account-button-text")}
            </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
