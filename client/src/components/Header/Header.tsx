import { Navbar, Container, Nav } from 'react-bootstrap';
import './Header.scss';

const Header = () => (
  <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
    <Container>
      <Navbar.Brand href="/">Ordish</Navbar.Brand>
      <Navbar.Toggle aria-controls="main-navbar" />
      <Navbar.Collapse id="main-navbar">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/about">About</Nav.Link>
          {/* Add more links as needed */}
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Header;