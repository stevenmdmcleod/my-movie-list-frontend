import { Button } from 'react-bootstrap';
import robot from "../../assets/Images/3828537.jpg"
import "./NoMatch.css";

function NoMatch() {
  return (

    <div className="display">
    <div className="display__img">
      <img className="robot-image" src={robot} alt="404-Bot" />
    </div>
    <div className="display__content">
      <h2 className="display__content--info">I have bad news for you</h2>
      <p className="display__content--text">
        The page you are looking for is unavailable
      </p>
      <Button className="nomatch-button" href="/">Back to homepage</Button>
    </div>
  </div>
  )
}

export default NoMatch