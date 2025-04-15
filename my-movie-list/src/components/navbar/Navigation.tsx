import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import "./Navigation.css";
import { useAuth } from '../../context/userAuth';

const Navigation = () => {
  const { isLoggedIn, logout, isAdmin } = useAuth();


  return (
    <Navbar expand="lg" className="nav-background">
      <Container>
        <Navbar.Brand href="/">My Movie List</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link id="nav-link" href="/friends">Friends</Nav.Link>
            <Nav.Link href="/myWatchLists">My Watchlists</Nav.Link>
            <Nav.Link href="/watchLists">Watchlists</Nav.Link>
            <Nav.Link href="/about">About</Nav.Link>
            {isAdmin() && 
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            }
            
            {/* <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
            <Col xs="auto">
            <Form.Control
              type="text"
              placeholder="Search by title..."
              className=" mr-sm-2"
            />
          </Col>
          <Col xs="auto">
            <Button type="submit">Submit</Button>
          </Col>

          </Nav>
        </Navbar.Collapse>
      </Container>
      <Col className="profile-button">
          <div className="profile-button-button">
            <Button href="/profile">Profile</Button>
          </div>
          {isLoggedIn() ? (
          <div className="profile-button-button">
            <Button onClick={logout} href="/profile">Logout</Button>
          </div>
          ) : (
            <div className="profile-button-button">
            <Button href="/login">Login</Button>
          </div>
          )}
      </Col>

    </Navbar>

  );
};

export default Navigation;