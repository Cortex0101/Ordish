import {
  Navbar,
  Container,
  Nav,
  Button,
  Offcanvas,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import { PersonCircle, List, X } from "react-bootstrap-icons";
import { useState, useRef, useEffect } from "react";
import "./Header.scss";
import smLogo from "../../assets/img/logo-sm.webp";
import { headerTestIds } from "./Header.testIds";

const OffcanvasMenu = ({ 
  show, 
  onHide, 
  headerHeight 
}: { 
  show: boolean; 
  onHide: () => void; 
  headerHeight: number; 
}) => {
  const { t } = useTranslation('header');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onHide();
  };

  const handleLogout = async () => {
    await logout();
    onHide();
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      data-testid={headerTestIds.offcanvas}
      id="navbar-offcanvas"
      backdrop={false}
      aria-labelledby="offcanvas-title"
      style={{ 
        top: `${headerHeight}px`,
        height: `calc(100vh - ${headerHeight}px)`
      }}
    >
      <Offcanvas.Header data-testid={headerTestIds.offcanvasCloseButton}>
        <Offcanvas.Title id="offcanvas-title" data-testid={headerTestIds.offcanvasTitle}>
          Ordish
        </Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="d-flex flex-column p-0">
        <Nav className="flex-column flex-grow-1 p-4">
          {/* Games Section */}
          <div className="nav-section mb-4" data-testid={headerTestIds.gamesSection}>
            <h6 className="nav-section-title text-uppercase fw-bold mb-3 text-muted">
              {t('games')}
            </h6>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navWordle}
            >
              {t('wordle')}
            </Nav.Link>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navSpellingBee}
            >
              {t('spellingBee')}
            </Nav.Link>
          </div>

          {/* Tools Section */}
          <div className="nav-section mb-4" data-testid={headerTestIds.toolsSection}>
            <h6 className="nav-section-title text-uppercase fw-bold mb-3 text-muted">
              {t('tools')}
            </h6>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navWordFinder}
            >
              {t('wordFinder')}
            </Nav.Link>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navWordleCheat}
            >
              {t('wordleCheat')}
            </Nav.Link>
          </div>

          {/* Articles Section */}
          <div className="nav-section mb-4" data-testid={headerTestIds.articlesSection}>
            <h6 className="nav-section-title text-uppercase fw-bold mb-3 text-muted">
              {t('articles')}
            </h6>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navRecent}
            >
              {t('recent')}
            </Nav.Link>
          </div>

          {/* More Section */}
          <div className="nav-section mb-4" data-testid={headerTestIds.moreSection}>
            <h6 className="nav-section-title text-uppercase fw-bold mb-3 text-muted">
              {t('more')}
            </h6>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navHome}
            >
              {t('home')}
            </Nav.Link>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/about')}
              data-testid={headerTestIds.navAbout}
            >
              {t('about')}
            </Nav.Link>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navContact}
            >
              {t('contact')}
            </Nav.Link>
            <Nav.Link 
              className="nav-section-link ps-3 py-2"
              onClick={() => handleNavigation('/')}
              data-testid={headerTestIds.navFaq}
            >
              {t('faq')}
            </Nav.Link>
          </div>
        </Nav>

        {/* Auth Section - Sticky to bottom */}
        <div 
          className="auth-section mt-auto p-3"
          data-testid={headerTestIds.authSection}
        >
          {user ? (
            <>
              <div className="auth-single-button">
                <Button
                  variant="outline-primary"
                  className="w-100"
                  onClick={() => handleNavigation('/profile')}
                  data-testid={headerTestIds.accountButton}
                >
                  {t('goToAccount')}
                </Button>
              </div>
              <div className="auth-buttons-row">
                <Button
                  variant="danger"
                  onClick={handleLogout}
                  data-testid={headerTestIds.logoutButton}
                >
                  {t('logout')}
                </Button>
              </div>
            </>
          ) : (
            <div className="auth-buttons-row">
              <Button
                variant="primary"
                onClick={() => handleNavigation('/login')}
                data-testid={headerTestIds.loginButton}
              >
                {t('login')}
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleNavigation('/signup')}
                data-testid={headerTestIds.signupButton}
              >
                {t('signup')}
              </Button>
            </div>
          )}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

const NavigationBar = ({ 
  showOffcanvas, 
  onToggleOffcanvas,
  headerRef
}: { 
  showOffcanvas: boolean; 
  onToggleOffcanvas: () => void;
  headerRef: React.RefObject<HTMLElement | null>;
}) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleAuthButtonClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  return (
    <Navbar 
      expand={false} 
      as={"header"}
      className="mb-2 px-0 py-0 bg-primary" 
      data-testid={headerTestIds.navbar}
      ref={headerRef}
    >
      <Container fluid className="px-0">
        <Button
          variant="outline-secondary"
          className="header-offcanvas-toggle d-flex align-items-center justify-content-center"
          onClick={onToggleOffcanvas}
          aria-controls="navbar-offcanvas"
          aria-expanded={showOffcanvas}
          data-testid={headerTestIds.offcanvasToggle}
        >
          {showOffcanvas ? (
            <X size={20} className="offcanvas-icon-close" />
          ) : (
            <List size={20} className="offcanvas-icon-open" />
          )}
        </Button>

        {/* Center: Brand with Logo */}
        <Navbar.Brand 
          href="/" 
          className="position-absolute start-50 translate-middle-x d-flex align-items-center"
          data-testid={headerTestIds.brand}
        >
          <Image
            alt="Ordish Logo"
            src={smLogo}
            width="30"
            height="30"
            className="d-inline-block"
            data-testid={headerTestIds.brandLogo}
          />
          <div 
            className="d-none d-sm-inline-block mx-2"
            style={{ 
              height: "24px", 
              borderLeft: "1px solid var(--bs-border-color)" 
            }}
            data-testid={headerTestIds.brandDivider}
          />
          <span 
            className="d-none d-sm-inline fw-bold"
            data-testid={headerTestIds.brandText}
          >
            Ordish
          </span>
        </Navbar.Brand>

        {/* Right: Auth Button */}
        <Button
          variant={user ? "outline-primary" : "outline-secondary"}
          className="border-0 d-flex align-items-center justify-content-center"
          style={{ width: "40px", height: "40px" }}
          onClick={handleAuthButtonClick}
          disabled={loading}
          data-testid={headerTestIds.authButton}
          aria-label={user ? "Go to profile" : "Login"}
        >
          <PersonCircle size={20} />
        </Button>
      </Container>
    </Navbar>
  );
};

const Header = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
      }
    };

    // Initial measurement
    updateHeaderHeight();

    // Update on window resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, []);

  const handleToggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
  };

  return (
    <>
      <NavigationBar 
        showOffcanvas={showOffcanvas}
        onToggleOffcanvas={handleToggleOffcanvas}
        headerRef={headerRef}
      />
      <OffcanvasMenu 
        show={showOffcanvas} 
        onHide={handleCloseOffcanvas}
        headerHeight={headerHeight}
      />
    </>
  );
};

export default Header;
