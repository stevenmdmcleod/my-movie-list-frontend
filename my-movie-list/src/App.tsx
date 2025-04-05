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
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="app-container">
        <Navigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/watchlists" element={<Watchlists />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mywatchlists" element={<MyWatchLists />} />
            <Route path="/movieinformation" element={<MovieInformation />} />
            <Route path="*" element={<NoMatch />} />
          
          </Routes>
        </main>
      <Footer />
    </div>
  );
}

export default App;
