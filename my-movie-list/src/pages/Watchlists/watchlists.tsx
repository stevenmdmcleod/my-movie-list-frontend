import React, { useEffect, useState } from "react";
import "./watchlists.css";
import axios from "axios";
import { getPublicWatchlists } from "../../utils/databaseCalls";

let API_KEY = import.meta.env.VITE_WATCHMODE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
  poster:string;
}

function watchlists() {

  const [watchlists, setWatchlists] = useState<WatchlistData[]>([]);
  const [titleMap, setTitleMap] = useState<Map<string, TitleData>>(new Map());



  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPublicWatchlists();//await axios.get(`${BASE_URL}/watchlist/public`);
        
        const data = result?.data || [];
        setWatchlists(data);

         // Collect all unique title IDs
         const allIds = data.flatMap((wl:WatchlistData) => wl.titles);
         const uniqueIds = Array.from(new Set(allIds));

         console.log("unique Ids ", uniqueIds);

         const map = new Map<string, TitleData>();

         // Fetch all titles one by one from Watchmode API
        await Promise.all(
          uniqueIds.map(async (id) => {
            try {
              const res = await axios.get(`https://api.watchmode.com/v1/title/${id}/details/?apiKey=${API_KEY}`);
              map.set(id as string, {
                title: res.data.title || "Untitled",
                poster: res.data.poster || "/src/assets/Images/default-title-image.png"
              });
            } catch {
              map.set(id as string, {
                title: "Unknown Title",
                poster: "/src/assets/Images/default-title-image.png"
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

  

 

  



  return (
    
    <div className="public-watchlists-container">
      <h1>Explore Public Watchlists</h1>
      <div className="watchlist-grid">
        {watchlists.map((wl) => (
                  <div key={wl.listId} className="watchlist-card">
                    <h3 className="watchlist-name">{wl.listName}</h3>
  <p className="watchlist-username">{wl.username}</p>

  <div className="title-grid">
  {wl.titles.slice(0, 4).map((titleId, index) => {
    const title = titleMap.get(titleId);
    return (
      <div key={index} className="title-cell">
        <img
          src={title?.poster || "/src/assets/Images/default-title-image.png"}
          alt={title?.title || "title"}
          className="title-poster"
        />
        <p className="title-name">{title?.title || "Title"}</p>
      </div>
    );
  })}
</div>
  <p className="collaborators"><strong>Collaborators:</strong> {wl.collaborators.join(', ')}</p>

  <div className="likes-comments">
    <p><strong>Likes</strong></p>
    <p><strong>Comments</strong></p>
  </div>
                  </div>
                ))}
                </div>
      
    </div>
  );
}

export default watchlists;
