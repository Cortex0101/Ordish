import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import "./Login.scss";

function Login() {
  const { t } = useTranslation("login");

  return (
    <Container className="container-sm">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1>{t("top-description")}</h1>
          <Form className="mt-4">
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t("email-placeholder")}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Col className="d-grid gap-2">
                <Button variant="primary" size="lg">
                  {t("continue-button-text")}
                </Button>
              </Col>
            </Row>
          </Form>
          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted">eller</span>
            <hr className="flex-grow-1" />
          </div>
          <Row className="mb-2">
            <Col>
              <Button variant="outline-primary" size="lg" className="w-100 d-flex align-items-center justify-content-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="me-2"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.406.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.406 24 22.674V1.326C24 .592 23.406 0 22.675 0" />
                </svg>
                {t("continue-facebook")}
              </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
            <Button variant="outline-primary" size="lg"  className="w-100 d-flex align-items-center justify-content-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="me-2"
                viewBox="0 0 24 24"
              >
                <path d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.03-1.17.96-2.07 2.07-2.07zm4.95 16.62c-.12.27-.24.54-.39.81-.51.93-1.05 1.85-1.89 1.85-.81 0-1.08-.53-2.01-.53-.93 0-1.23.51-2.01.53-.84 0-1.41-.86-1.92-1.79-1.32-2.28-.23-5.65 1.86-5.65.72 0 1.29.5 2.01.5.69 0 1.21-.5 2.01-.5 1.02 0 1.78 1.04 2.01 2.08-.03.01-.06.02-.09.03-.18.06-.37.13-.56.21-.19.08-.37.17-.55.27-.18.1-.36.21-.53.33-.17.12-.33.25-.48.39-.15.14-.29.29-.42.45-.13.16-.25.33-.36.51-.11.18-.21.37-.3.57-.09.2-.17.41-.24.62-.07.21-.13.43-.18.65-.05.22-.09.45-.12.68-.03.23-.05.47-.06.71-.01.24-.01.48 0 .72.01.24.03.48.06.71.03.23.07.46.12.68.05.22.11.44.18.65.07.21.15.42.24.62.09.2.19.39.3.57.11.18.23.35.36.51.13.16.27.31.42.45.15.14.31.27.48.39.17.12.35.23.53.33.18.1.36.19.55.27.19.08.38.15.56.21.03.01.06.02.09.03-.23 1.04-.99 2.08-2.01 2.08-.8 0-1.32-.5-2.01-.5-.72 0-1.29.5-2.01.5-2.09 0-3.18-3.37-1.86-5.65.51-.93 1.08-1.79 1.92-1.79.78-.02 1.08.51 2.01.51.93 0 1.2-.53 2.01-.53.84 0 1.38.92 1.89 1.85.15.27.27.54.39.81z" />
              </svg>
              {t("continue-apple")}
            </Button>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col>
            <Button
              variant="outline-primary"
              size="lg"
              className="w-100 d-flex align-items-center justify-content-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                className="me-2"
                viewBox="0 0 24 24"
              >
                <path d="M21.805 10.023h-9.765v3.977h5.627c-.242 1.242-1.242 3.242-5.627 3.242-3.389 0-6.148-2.805-6.148-6.242s2.759-6.242 6.148-6.242c1.934 0 3.242.773 3.984 1.477l2.727-2.648c-1.773-1.648-4.07-2.656-6.711-2.656-5.523 0-10 4.477-10 10s4.477 10 10 10c5.773 0 9.594-4.055 9.594-9.773 0-.656-.07-1.148-.156-1.664z" />
              </svg>
              {t("continue-google")}
            </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
