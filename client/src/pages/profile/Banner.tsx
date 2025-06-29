import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import "./Banner.scss";

interface ProfileBannerProps {
  userName: string;
  userVisitedCount?: number;
  userVisitedDays?: number;
  userJoinedDate?: string;
  userLastActive?: string;
  userAvatarUrl?: string;
  userFriendsCount?: number;
}

const Banner: React.FC<ProfileBannerProps> = (props) => {
  const { t } = useTranslation("profile");

  return (
    <Container className="shadow-lg p-3 mb-5 rounded border">
      <Row>
        <Col xs={3}>
          {props.userAvatarUrl ? (
            <img
              src={props.userAvatarUrl}
              alt="Profile"
              className="rounded-circle"
              style={{
                width: "32px",
                height: "32px",
                objectFit: "cover",
                border: "2px solid transparent",
                transition: "border-color 0.2s, background 0.2s",
              }}
            />
          ) : (
            <div
              className="replacement-avatar rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
            >
              {props.userName[0]?.toUpperCase() || "?"}
            </div>
          )}
        </Col>
        <Col xs={6}>
          <Row>
            <Col>
              <h2 className="mb-0 text-truncate">{props.userName}</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <p className="text-muted mb-0">
                {t("member_since")} {props.userJoinedDate || "N/A"}
              </p>
            </Col>
          </Row>
          <Row>

          </Row>
        </Col>
        <Col xs={3}>

                <Button 
                  variant="outline-danger"
                  className="w-100"
                  onClick={() => {
                    fetch("/api/auth/logout", {
                      method: "POST",
                      credentials: "include",
                    })
                      .then((response) => {
                        if (response.ok) {
                          window.location.href = "/";
                        } else {
                          console.error("Logout failed");
                        }
                      })
                      .catch((error) => {
                        console.error("Logout error:", error);
                      });
                  }}
                >
                    {t("logout")}
                </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Banner;
