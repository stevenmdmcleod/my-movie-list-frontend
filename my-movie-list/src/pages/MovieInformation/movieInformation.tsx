import React, { useEffect, useState } from "react";
import "./movieInformation.css";
import example from "./exampleResponse.json";
import { useParams } from "react-router";

let API_KEY= import.meta.env.VITE_WATCHMODE_API_KEY;
console.log(API_KEY);


function MovieInformation() {
  const {titleid} = useParams();



  let apiURL = `https://api.watchmode.com/v1/title/${titleid}/details/?apiKey=${API_KEY}`;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const response: any = await fetch(apiURL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setData(json);
        setError(null);
      } catch (e) {
        
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiURL]);

  if (loading) {
    return <p>Loading...</p>;
  }

  
  const title: any = data;
  
  if(!title){
    return <h1 style={{color: "white"}}>Could not find title</h1>;
  }
  
  //get youtube trailer
  function getTitleId(url: string) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
}
const youtubeEmbed: string = "//www.youtube.com/embed/";
const videoId = getTitleId(title.trailer);


  return (
    <div className="page">
      
        <div className="leftblock">
          <img
            src={title.poster}
            className="rounded mx-auto d-block"
            alt="Image Not Found"
          ></img>
          <p>placeholder</p>
        </div>

        <div className="centerblock">
          <h1><u>{title.title}</u></h1>
          <p>
            <br />
            {"Plot Overview: " + title.plot_overview}
          </p>

        </div>

        <div className="rightblock">

        <iframe  width={300} height={300}
          src={`${youtubeEmbed}${videoId}`} title="trailer" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen>
        </iframe> 
        <p>placeholder</p>
        </div>
    </div>
  );
}

export default MovieInformation;
