import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Col, Container, Row } from 'react-bootstrap';
import './About.css';

function About() {
  return (
    <Container>
      <Row>
        <Col>
    <Card style={{ width: '500px', height: '670px' }}>
      <Card.Body>
        <h1>About</h1>
        <Card.Title>A dedicated movie gallery at your fingertips</Card.Title>
        <Card.Text>
        Create your personalized list from tens of thousands of titles from an expansive and dedicated movie database.
        </Card.Text>
        <Card.Title>Stay up to date</Card.Title>
        <Card.Text>
        Use your individual list to organize and track your movie viewing journey. Planning what to watch next is easy!
        </Card.Text>
        <Card.Title>Join our community!</Card.Title>
        <Card.Text>
        Discover more movies via our ever-growing community. View other users' movie lists and add to your own to show off!
        </Card.Text>
        <Button className="about-btn" variant="primary" href="/registration">Sign Up Here</Button>
      </Card.Body>
    </Card>
    </Col>
    <Col>
    <Card style={{ width: '500px', height: '450px' }}>

      <Card.Img variant="top" src="/src/assets/Images/pexels-rao-qingwei-400570939-18176581.jpg" />

    </Card>
    </Col>
    </Row>
    </Container>
  );
}

export default About