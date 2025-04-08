import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home/Home"
import Footer from "./components/footer/Footer";
import Navigation from "./components/navbar/Navigation";
import About from "./pages/About/About";
import NoMatch from "./pages/NoMatch/NoMatch";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration"
import Friends from "./pages/Friends/friends";
import Profile from "./pages/Profile/profile";
import Dashboard from "./pages/Dashboard/dashboard";
import MovieInformation from "./pages/MovieInformation/movieInformation";
import MyWatchLists from "./pages/MyWatchlists/myWatchLists";
import Watchlists from "./pages/Watchlists/watchlists";
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import 'bootstrap/dist/css/bootstrap.min.css';

// TEMPORARY IMPORTS REMOVE WHEN NEEDED
// import axios from 'axios';
// import { useEffect } from "react";

function App() {
  // TEMPORARY LOGIN FUNCTION TO RETRIEVE JWT
  // UNCOMMENT FOR TESTING
  // REMOVE WHEN NOT NEEDED

  // useEffect(() => {
  //   try {
  //     async function login() {
  //       const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,{
  //         username: "nickbowden", // replace with test user information
  //         password: "asdfasdf"
  //     });
    
  //     if (res.status === 200) {
  //       window.localStorage.setItem("token", res.data.token); // Stores JWT in window localStorage
  //     }
    
  //     }
  //     login();
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, []);

  return (
    <div className="app-container">
      <div className="page-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/watchlists" element={<Watchlists />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mywatchlists" element={<MyWatchLists />} />
            <Route path="/movieinformation/:titleid" element={<MovieInformation />} />
            <Route path="*" element={<NoMatch />} />
          
          </Routes>
        </main>
      <Footer />
      </div>
    </div>
  );
}

export default App;
