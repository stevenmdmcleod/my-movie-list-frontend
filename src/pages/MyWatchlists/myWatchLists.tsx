import { useEffect, useState } from "react";
import "./myWatchLists.css";
import {
  getUserCollaborativeWatchlists,
  getUserWatchlists,
  createWatchlist
} from "../../utils/databaseCalls";

import { useNavigate } from "react-router";


function myWatchLists() {
  const navigate = useNavigate();

  const [userWatchlists, setUserWatchlists] = useState<any[]>([]);
  const [collaborativeWatchlists, setCollaborativeWatchlists] = useState<any[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>("");

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
          setCollaborativeWatchlists(response.data.watchlist);
        }
      } catch (error) {
        console.error("Error fetching user watchlists:", error);
      }
    };
    fetchCollaborativeWatchlists();
  }, []);

  const handleNavigation = (listId: string) => {
    navigate(`/watchlist/${listId}`); // Navigate to the desired route
  };


  const handleCreateWatchlist = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault(); // Prevent the default form submission behavior
  
    const inputElement = document.getElementById("listNameInput") as HTMLInputElement;
    const listName = inputElement.value.trim(); // Get the value from the input field
  
    if (!listName) {
      console.error("Watchlist name cannot be empty");
      return;
    }
    else{
      const response: any = await createWatchlist(listName);
      //console.log(response);
      if (response.status === 201) {
        
        navigate(`/watchlist/${response.data.watchlist.listId}`); // Navigate to the new watchlist page
      }
      else {
        console.error("Failed to create watchlist:", response);
        setErrorMessage("Failed to create watchlist. Please try again."); // Set error message
      }
    }
    } catch (error) {
      console.error("Error creating watchlist: watchlist exists already");
      setErrorMessage("Failed to create watchlist. watchlist already exists"); // Set error message
    }
    
}

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
        <div className="createwatchlist">
          <form className="createwatchlistform" onSubmit={(e) => handleCreateWatchlist(e)}>
            <input type="text" id="listNameInput" placeholder="name your watchlist"/>
            
          <button className="createwatchlistbutton" type="submit">
            Create Watchlist
          </button>
          </form>
          {errorMessage && (
    <p className="error-message" style={{ color: "red", marginTop: "5px" }}>
      {errorMessage}
    </p>
  )}
        </div>

      </div>
    </div>
  );
}

export default myWatchLists;
