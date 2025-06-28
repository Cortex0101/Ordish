import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import "./Header.scss";
import smLogo from "../../assets/img/logo-sm.webp";

const Header = () => {
  const { t } = useTranslation("header");
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally redirect to home page or show a message
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ""} ${user.last_name || ""}`.trim();
    }
    return user?.email || "User";
  };

  return (
    <Navbar bg="primary" expand="xl" className="mb-4">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            alt=""
            src={smLogo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          { /* show text Ordish on every size except xs */}
          <span className="d-none d-sm-inline">Ordish</span>
          { /* show text Ordish on every size except xs */}
        </Navbar.Brand>

        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
          </Nav>
        </Navbar.Collapse>

        <div className="d-flex align-items-center ms-auto">
          <div className="d-flex align-items-center me-2">
            <Button 
            variant="outline-success" 
            className="me-2">
              {t("login")}
            </Button>
            <Button 
            variant="success"
            href="/signup"
            >
              {t("signup")}
            </Button>
          </div>
        </div>

        <Navbar.Toggle aria-controls="main-navbar" />
      </Container>
    </Navbar>
  );
};

export default Header;
