import { useEffect, useState } from "react";
import "./myWatchLists.css";
import {
  getUserCollaborativeWatchlists,
  getUserWatchlists,
} from "../../utils/databaseCalls";

import { useNavigate } from "react-router";


function myWatchLists() {
  const navigate = useNavigate();

  const [userWatchlists, setUserWatchlists] = useState<any[]>([]);
  const [collaborativeWatchlists, setCollaborativeWatchlists] = useState<any[]>(
    []
  );

  useEffect(() => {
    const fetchUserWatchlists = async () => {
      try {
        const response: any = await getUserWatchlists();
        if (response.status === 200) {
          //console.log(response.data.watchlists);
          setUserWatchlists(response.data.watchlists);
        }
      } catch (error) {
        console.error("Error fetching user watchlists:", error);
      }
    };
    fetchUserWatchlists();
  }, []);

  useEffect(() => {
    const fetchCollaborativeWatchlists = async () => {
      try {
        const response: any = await getUserCollaborativeWatchlists();
        if (response.status === 200) {
          console.log(response);
          setCollaborativeWatchlists(response.data.watchlist);
        }
      } catch (error) {
        console.error("Error fetching user watchlists:", error);
      }
    };
    fetchCollaborativeWatchlists();
    console.log(
      "Collaborative watchlists fetched: ", collaborativeWatchlists);
  }, []);

  const handleNavigation = (listId: string) => {
    navigate(`/watchlist/${listId}`); // Navigate to the desired route
  };

  return (
    <div className="mywatchlistpagecontainer">
      <h1 style={{ textAlign: "center" }}>My Watchlists</h1>
      <div className="mywatchlistpage">
        <div className="mywatchlists">
          <h2>My Watchlists</h2>

          {userWatchlists.map((watchlist: any) => (
            <button
              onClick={() => handleNavigation(`${watchlist.listId}`)}
              className="userwatchlists"
              key={watchlist.listId}
              value={watchlist.listId}
            >
              {watchlist.listName}
            </button>
          ))}
        </div>

        <div className="collaborativewatchlists">
          <h2>Collaborative Watchlists</h2>
          {collaborativeWatchlists.map((collabwatchlist: any) => (
            <button
              onClick={() => handleNavigation(`${collabwatchlist.listId}`)}
              className="collaborativewatchlists"
              key={collabwatchlist.listId}
              value={collabwatchlist.listId}
            >
              {collabwatchlist.listName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default myWatchLists;
