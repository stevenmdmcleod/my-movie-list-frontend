import { useEffect, useState } from "react";
import "./movieInformation.css";
import { useParams } from "react-router";
import { getUserWatchlists, AddRemoveTitleFromWatchlist } from "../../utils/databaseCalls";
import { BASE_ROUTE } from "../../utils/config";






function MovieInformation() {
  const { titleid } = useParams();
  const apiURL = `${BASE_ROUTE}/watchmode/title/${titleid}`;

  const [data, setData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [similarTitles, setSimilarTitles] = useState<{ poster: string; title: string; id: number }[] | null>([]);
  const [userWatchlists, setUserWatchlists] = useState<any[] | null>([]);

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

  useEffect(() => {
    if (data && Array.isArray(data.similar_titles) && data.similar_titles.length > 0) {
      const fetchSimilarTitles = async () => {
        const similarTitlesList: { poster: string; title: string; id: number }[] = [];
  
        for (let i = 0; i < Math.min(data.similar_titles.length, 5); i++) {
          const similarTitleID = data.similar_titles[i];
          const similarTitleURL = `${BASE_ROUTE}/watchmode/title/${similarTitleID}`;
  
          try {
            const response = await fetch(similarTitleURL);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const similarData = await response.json();
            similarTitlesList.push({
              poster: similarData.poster,
              title: similarData.title,
              id: similarData.id,
            });
          } catch (e) {
            console.error("Error fetching similar title:", e);
          }
        }
  
        setSimilarTitles(similarTitlesList);
      };
  
      fetchSimilarTitles();
    } else {
      console.warn("No similar titles available or data is not loaded yet.");
    }
  }, [data]);

  useEffect(() => {
    const fetchUserWatchlists = async () => {
      try {
        const response = await getUserWatchlists();
        if (response.status === 200) {
          setUserWatchlists(response.data.watchlists);
        } else {
          console.error("Failed to fetch watchlists:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user watchlists:", error);
      }
    };
  
    fetchUserWatchlists();
  }, []);

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
              {similarTitles && similarTitles.length > 0 ? (
                similarTitles.map((similar, index) => (
                  <button key={index} className="similar-title" onClick={() => window.location.href = `/movieinformation/${similarTitles[index].id}`}>
                    <img
                      src={similar.poster ?? ""}
                      className="rounded mx-auto d-block"
                      alt="similar title not found"
                    />
                    <p>{similar.title ?? "Title Not Found"}</p>
                  </button>
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
          <label >Add/Remove from watchlist:</label>
          <select className="watchlist-select" onChange={(e) => AddRemoveTitleFromWatchlist(e.target.value, titleid ?? "")}>
          
          <option value="">Select a watchlist</option>
            {userWatchlists && userWatchlists.map((watchlist) => (
              <option key={watchlist.listId} value={watchlist.listId}>
                {watchlist.listName}
              </option>
            ))};
          </select>
          
        </div>
      </div>
    </div>
  );
}

export default MovieInformation;
