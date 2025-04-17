import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "./Navigation.css";
import { useAuth } from "../../context/userAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  // Define the query state
  const [query, setQuery] = useState("");
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const navigate = useNavigate();



  
  return (
    <Navbar expand="lg" className="nav-background">
      <Container>
        <Navbar.Brand href="/" data-text="My Movie List">My Movie List</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn() ? (
            <Nav.Link id="nav-link" href="/friends" data-text="Friends">Friends</Nav.Link>
          ) : (
            <p></p>
          )}
            {isLoggedIn() ? ( 
            <Nav.Link href="/myWatchLists" data-text="My Watchlists">My Watchlists</Nav.Link>
          ) : (
            <p></p>
          )}
            <Nav.Link href="/watchLists" data-text="Watchlists">Watchlists</Nav.Link>
            <Nav.Link href="/about" data-text="About">About</Nav.Link>
            {isAdmin() && 
              <Nav.Link href="/dashboard" data-text="Dashboard">Dashboard</Nav.Link>
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

            <Form style={// overwriting bootstrap form styles to fit navbar (very important)
                  {width: "unset ",
                  backgroundColor: "unset",
                  
                  left: "unset",
                  borderRadius: "unset",
                  backdropFilter: "unset",
                  border: "unset",
                  boxShadow: "unset",
                  padding: "unset",
                  display: "flex",
                  gap: "1rem"}}
                  onSubmit={(e) => {
                    navigate(`/searchresults/${query}`);
                    e.preventDefault();}}>

              
                <Form.Control
                style={{
                  flexGrow: 1,
                  minWidth: "15rem"
                }}
                  type="text"
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  
                  
                  className="mr-sm-2"
                  value={query}                               
                  placeholder="search for a title..."
                />
                <Button type="submit">Submit</Button>
              
            </Form>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Col className="profile-button">
      {isLoggedIn() ? (
        <div className="profile-button-button">
          <Button href="/profile">Profile</Button>
        </div>
      ) : (
        <p></p>
      )}
        {isLoggedIn() ? (
          <div className="profile-button-button">
            <Button onClick={logout} href="/profile">
              Logout
            </Button>
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
