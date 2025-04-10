import React, { useEffect, useState } from "react";
import "./movieInformation.css";
import { useParams } from "react-router";

const API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;

interface MovieData {
  title: string;
  similar_titles: string[];
  poster: string;
  trailer: string;
  user_rating: string;
  critic_score: string;
  us_rating: string;
  release_date: string;
  type: string;
  plot_overview: string;
  genre_names: string[];
}

function MovieInformation() {
  console.log(API_KEY);
  const { titleid } = useParams();
  const apiURL = `https://api.watchmode.com/v1/title/${titleid}/details/?apiKey=${API_KEY}`;

  const [data, setData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarTitles, setSimilarTitles] = useState<
    { poster: string; title: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async (url: string) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (e) {
        setError("Could not fetch movie data.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData(apiURL);
  }, [titleid]); //runs when titleid changes

  // Fetch similar titles after main title is loaded
  useEffect(() => {
    if (data && data.similar_titles.length > 0) {
      const fetchSimilarTitles = async () => {
        const similarTitlesList: { poster: string; title: string }[] = [];

        for (let i = 0; i < Math.min(data.similar_titles.length, 5); i++) {
          const similarTitleID = data.similar_titles[i];
          const similarTitleURL = `https://api.watchmode.com/v1/title/${similarTitleID}/details/?apiKey=${API_KEY}`;

          try {
            const response = await fetch(similarTitleURL);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const similarData = await response.json();
            similarTitlesList.push({
              poster: similarData.poster,
              title: similarData.title,
            });
          } catch (e) {
            console.error("Error fetching similar title:", e);
          }
        }

        setSimilarTitles(similarTitlesList);
      };

      fetchSimilarTitles();
    }
  }, [data]); // Only run when data (movie details) is available

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!data) {
    return <h1 style={{ color: "white" }}>Could not find title</h1>;
  }

  // Get genres
  let genres: string = "";
  if (data.genre_names) {
    genres = data.genre_names.join(", ");
  } else {
    genres = "No genre information found";
  }

  // Get YouTube trailer ID
  function getTitleId(url: string) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  const youtubeEmbed: string = "//www.youtube.com/embed/";
  let videoId: string | null = null;
  if (data.trailer) {
    videoId = getTitleId(data.trailer);
  }

  return (
    <div className="default">
      <div className="page">
        <div className="leftblock">
          <img
            src={data.poster}
            className="rounded mx-auto d-block"
            alt="Image Not Found"
          />
          <p>{`User rating: ${data.user_rating ?? "Not known"}`}</p>
          <p>{`Critic score: ${data.critic_score ?? "Not known"}`}</p>
          <p>{`Rated: ${data.us_rating ?? "Not known"}`}</p>
          <p>{`Release date: ${data.release_date ?? "Not known"}`}</p>
          <p>{`Type: ${data.type ?? "Not known"}`}</p>
        </div>

        <div className="centerblock">
          <h1>
            <u>{data.title}</u>
          </h1>
          <p>
            <br />
            {`Plot Overview: ${data.plot_overview ?? "No plot available"}`}
          </p>
          <p>
            <br />
            {`Genres: ${genres}`}
          </p>
          <>
            <h1>
              <u>{"Similar Titles"}</u>
            </h1>
            {/* Render similar titles only if available */}
            <div className="similar-titles">
              {similarTitles.length > 0 ? (
                similarTitles.slice(0, 4).map((similar, index) => (
                  <div key={index} className="similar-title">
                    <img
                      src={similar.poster ?? ""}
                      className="rounded mx-auto d-block"
                      alt="similar title not found"
                    />
                    <p>{similar.title ?? "Title Not Found"}</p>
                  </div>
                ))
              ) : (
                <p>No similar titles found</p>
              )}
            </div>
          </>
        </div>

        <div className="rightblock">
          <iframe
            width={300}
            height={300}
            src={`${youtubeEmbed}${videoId ?? "not found"}`}
            title="trailer"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
          <p>placeholder</p>
        </div>
      </div>
    </div>
  );
}

export default MovieInformation;
