import React, { useEffect, useRef, useState } from "react";
import "./watchlists.css";
import axios from "axios";


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

interface titleData {
  id: string;
  title: string;
  poster:string;
}

function watchlists() {

  const [watchlists, setWatchlists] = useState<WatchlistData[]>([]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get(`${BASE_URL}/watchlist/public`);
        
        setWatchlists(result.data);

        
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    const fetchTitleInfo = async (ids: string[]) => {
      try {
        const response = await axios.get(`${BASE_URL}/titles`, {
          params: { ids: ids.join(',') }
        });
    
        // Assume response.data is an array of title info objects
        const titleMap = new Map<string, { name: string; posterUrl: string }>();
        response.data.forEach((title: any) => {
          titleMap.set(title.id, {
            name: title.name,
            posterUrl: title.posterUrl
          });
        });
    
        return titleMap;
      } catch (error) {
        console.error("Failed to fetch title info:", error);
        return new Map();
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
    {wl.titles.slice(0, 4).map((title, index) => (
      <div key={index} className="title-cell">
        <img
          src="/src/assets/Images/default-title-image.png"
          alt="title"
          className="title-poster"
        />
        <p className="title-name">title</p>
      </div>
    ))}
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
