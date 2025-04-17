import { useEffect, useState } from "react";
import "./watchlists.css";
import axios from "axios";
import { addFriend, getFriends, getPublicWatchlists } from "../../utils/databaseCalls";
import { decodeToken, userJwt } from "../../utils/jwt";
import { Link } from "react-router";
import { BASE_ROUTE } from "../../utils/config";
import defaultTitle from "../../assets/Images/default-movie-cover.jpg";

const token = localStorage.getItem("token") || "";
const user = decodeToken(token) as userJwt;
const currentUsername = user?.username;

interface WatchlistData {
  listId: string;
  listName: string;
  userId: string;
  username: string;
  comments: string[];
  likes: string[];
  titles: string[];
  collaborators: string[];
}

interface TitleData {
  title: string;
  poster: string;
}

function watchlists() {

  const [watchlists, setWatchlists] = useState<WatchlistData[]>([]);
  const [titleMap, setTitleMap] = useState<Map<string, TitleData>>(new Map());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [friends, setFriends] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPublicWatchlists();

        const data = result?.data || [];
        setWatchlists(data);

        if(token){
          const friendRes = await getFriends();
          setFriends(friendRes?.data.map((f: any) => f.username));
        }

        // Collect all unique title IDs
        const allIds = data.flatMap((wl: WatchlistData) => wl.titles);
        const uniqueIds = Array.from(new Set(allIds));

        const map = new Map<string, TitleData>();

        // Fetch all titles one by one from Watchmode API
        await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const res = await axios.get(
                `${BASE_ROUTE}/watchmode/title/${id}`
              );
              map.set(id as string, {
                title: res.data.title || "Untitled",
                poster:
                  res.data.poster ||
                  defaultTitle,
              });
            } catch {
              map.set(id as string, {
                title: "Unknown Title",
                poster: defaultTitle,
              });
            }
          })
        );
        setTitleMap(map);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleAddFriend = async (username: string) => {
    try {
      await addFriend(username);
      alert("Friend request sent!");
      setFriends((prev) => [...prev, username]);
    } catch (error) {
      console.error("Failed to send friend request:", error);
    }
  };

  const filteredWatchlists = watchlists.filter((wl) =>
    wl.listName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="public-watchlists-container">
      <div className="public-watchlists-header">
        <h1>Explore Public Watchlists</h1>
        <div className="search-section">
          <input
            type="text"
            placeholder="Search watchlists..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredWatchlists.length === 0 ? (
        <p style={{ marginTop: "2rem" }}>No watchlists found.</p>
      ) : (
        <div className="public-watchlist-grid">
          {filteredWatchlists.map((wl) => (
            <div key={wl.listId} className="public-watchlist-card">
              <h3>
              <Link to={`/watchlist/${wl.listId}`} className="public-watchlist-name">
                {wl.listName}
              </Link>
              </h3>
              
              <p className="watchlist-username-container">
                <span className="public-watchlist-username">{wl.username}</span>
                {token && wl.username !== currentUsername && !friends.includes(wl.username) && (
                  <button
                    className="add-friend-button"
                    onClick={() => handleAddFriend(wl.username)}
                  >
                    ➕ Add Friend
                  </button>
                )}
              </p>

              <div className="title-grid">
                {wl.titles.slice(0, 4).map((titleId, index) => {
                  const title = titleMap.get(titleId);
                  return (
                    <div key={index} className="title-cell">
                      <Link to={`/movieinformation/${titleId}`} className="title-link">
                        <img
                          src={
                            title?.poster ||
                            defaultTitle
                          }
                          alt={title?.title || "title"}
                          className="title-poster"
                        />
                        <p className="title-name">{title?.title || "Title"}</p>
                      </Link>
                    </div>
                  );
                })}
              </div>

              <div className="likes-comments">
              <p>
                <strong>Collaborators:</strong> {wl.collaborators.length}
              </p>
                <p><strong>Likes: </strong>{wl.likes.length}</p>
                <p><strong>Comments: </strong>{wl.comments.length}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default watchlists;
