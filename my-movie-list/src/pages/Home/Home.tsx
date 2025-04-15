import "./Home.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import action from "./action.json";
import comedy from "./comedy.json";
import newReleases from "./newreleases.json";
import { BASE_ROUTE } from "../../utils/config";

const Home = () => {
  const navigate = useNavigate();


  return (
    <div className="home-container">
      <div className="home">
        <h1>Welcome to My Movie List!</h1>
        <p>Your ultimate destination for all things movies.</p>
        <p>Discover, track, and share your favorite films with friends.</p>
        <p>Join us in exploring the world of cinema!</p>

        {/* New Releases Section */}
        <div className="newreleases-movies">
          <h2>New Releases</h2>
          <div className="movie-list">
            {newReleases.map((movie: any) => (
              <button
                key={movie.id}
                className="movie-card"
                onClick={() => navigate(`/movieinformation/${movie.id}`)}
              >
                <img src={movie.poster} alt={movie.title} />
                <h3>{movie.title}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Action Movies Section */}
        <div className="action-movies">
          <h2>Action Movies</h2>
          <div className="movie-list">
            {action.map((movie: any) => (
              <button
                key={movie.id}
                className="movie-card"
                onClick={() => navigate(`/movieinformation/${movie.id}`)}
              >
                <img src={movie.poster} alt={movie.title} />
                <h3>{movie.title}</h3>
              </button>
            ))}
          </div>
        </div>

        {/* Comedy Movies Section */}
        <div className="comedy-movies">
          <h2>Comedies</h2>
          <div className="movie-list">
            {comedy.map((movie: any) => (
              <button
                key={movie.id}
                className="movie-card"
                onClick={() => navigate(`/movieinformation/${movie.id}`)}
              >
                <img src={movie.poster} alt={movie.title} />
                <h3>{movie.title}</h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
