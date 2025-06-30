import {
  Navbar,
  Container,
  Nav,
  Button,
  Offcanvas,
  Image
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.scss";
import smLogo from "../../assets/img/logo-sm.webp";

const LoginAndSignupButtons = () => {
  const { t } = useTranslation("header");

  return (
    <div className="d-flex align-items-center ms-auto">
      <div className="d-flex align-items-center me-2">
        <Button variant="outline-success" className="me-2" href="/login">
          {t("login")}
        </Button>
        <Button variant="success" href="/signup">
          {t("signup")}
        </Button>
      </div>
    </div>
  );
};

const ProfileBadge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const getInitial = () => user.username?.[0]?.toUpperCase() || "?";

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <Nav.Link
      onClick={handleProfileClick}
      className="d-flex align-items-center ms-auto"
      style={{ border: "none", background: "none" }}
      title="Profile"
    >
      {user.avatar_url ? (
        <img
          src={user.avatar_url}
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
          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
          style={{
            width: "32px",
            height: "32px",
            fontSize: "12px",
            fontWeight: "bold",
            border: "2px solid transparent",
            transition: "border-color 0.2s, background 0.2s",
          }}
        >
          {getInitial()}
        </div>
      )}
    </Nav.Link>
  );
};

const Header = () => {
  const { user, loading } = useAuth();

  return (
    <Navbar expand={false} className="mb-2">
      <Container fluid>
        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Brand href="/">
          <Image
            alt=""
            src={smLogo}
            width="30"
            height="30"
            className="d-inline-block align-top mx-2"
          />
          <span className="d-none d-sm-inline">Ordish</span>
        </Navbar.Brand>
      
        <Navbar.Offcanvas
          id={`navbar-offcanvas-expand`}
          aria-labelledby={`offcanvas-title-expand`}
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id={`offcanvas-title-expand`}>
              Ordish
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        {user ? <ProfileBadge /> : <LoginAndSignupButtons />}
      </Container>
    </Navbar>
  );
};

export default Header;
