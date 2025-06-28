import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import './Header.scss';
import smLogo from '../../assets/img/logo-sm.webp'

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally redirect to home page or show a message
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getUserDisplayName = () => {
    if (user?.first_name || user?.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user?.email || 'User';
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="/">
            <img
              alt=""
              src={smLogo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Ordish
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <NavDropdown title={getUserDisplayName()} id="user-nav-dropdown" align="end">
                <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;