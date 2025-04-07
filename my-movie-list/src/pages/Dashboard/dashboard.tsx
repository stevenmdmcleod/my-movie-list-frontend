import React, { useEffect, useState } from 'react';
import './dashboard.css';
import { Link } from 'react-router-dom';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import BallotIcon from '@mui/icons-material/Ballot';
import ForumIcon from '@mui/icons-material/Forum';
import SearchIcon from '@mui/icons-material/Search';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import axios from "axios";

const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

interface CommentData {
  commentId: string;
  comment: string;
  datePosted: string;
  userId: string;
  username: string;
  watchlistId: string;
  watchlistName: string;
}

let users = [
    {
        username: 'user1',
        img:'/src/assets/Images/default-profile.jpg',
    },
    {
        username: 'user2',
        img:'/src/assets/Images/default-profile.jpg',
    },
    {
        username: 'user3',
        img:'/src/assets/Images/default-profile.jpg',
    },
]

function dashboard() {
  const [comments, setComments] = useState<CommentData[]>([]);
  
  useEffect(() => {
    axios.get('http://localhost:3000/watchlist/comments/all',
      { headers: {"Authorization" : `Bearer ${ADMIN_TOKEN}`} }
    )
      .then(res => {
        console.log(res.data.length);
        console.log(import.meta.env.ADMIN_TOKEN);
        setComments(res.data);
      })
      .catch(err => console.log(err));
  }, [])
  return (
    <>
      <div className="dashboard">

        <div className="sidebar">
          <div className="logo">
            <MovieFilterIcon className='logo-icon'/>
            <h2>My Movie List</h2>
          </div>
          <div className="menu">
            <Link className="item" to="/dashboard"><HomeIcon className='icon'/>Dashnoard</Link>
            <Link className="item" to="/users"><GroupIcon className='icon'/>Users</Link>
            <Link className="item" to="/watchlists"><BallotIcon className='icon'/>Watchlists</Link>
            <Link className="item" to="/comments"><ForumIcon className='icon'/>Commets</Link>
          </div>
        </div>

        <div className="main">
          <div className="main-header">
            <h1 className="header-title">Dashboard</h1>
            <div className="header-activity">
              <div className="search-box">
                <input type="text" placeholder='Search...' />
                <SearchIcon className='icon' />
              </div>
            </div>
          </div>
          <div className="main-content">
            <div className="content-users-watchlists">
              <div className="content-users">
                <div className="content-title">Users</div>
                <div className="users-list">
                {
                  users.map((item, index) => (
                    <div className="user-item" key={index}>
                      <div className="user-display">
                        <img src={item.img} alt="user photo"/>
                        {/* <img src={item.profilePicture ? item.profilePicture : '/src/assets/Images/user.png'} alt="user photo"/> */}
                      </div>
                      <div className="user-username">{item.username}</div>
                    </div>
                  ))
                }
                <div className="view-more">
                    <a href="/users" className="view-more-link">View More →</a>
                  </div>
                </div>
              </div>
              <div className="content-watchlists">watcjhlists</div>
            </div>
            <div className="content-comments">
              <div className="content-title">Comments</div>
              <div className="list-container">
                {
                  comments.slice(0,4).map((item, index) => (
                  <div className="comment-item" key={index}>
                    <div className="comment--content">
                      <div className="comment--title">
                        {new Date(item.datePosted).toLocaleString()} by <Link to="">{item.username}</Link> on <Link to="">{item.watchlistName}</Link>
                      </div>
                      <div className="comment--text">
                        {item.comment}
                      </div>
                    </div>
                    <div className="comment--buttons">
                      
                      <DeleteForeverIcon style={{ fontSize: 30, marginRight: '4px', color: 'e74c3c'}} />
                    </div>
                      
                  </div>
                  ))
                }
                <div className="comment-view-more">
                    <a href="/users" className="view-more-link">View More →</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="profile">profile</div>
      </div>
    </>
  )
}

export default dashboard