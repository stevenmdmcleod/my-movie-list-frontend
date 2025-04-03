import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home/Home"
import Footer from "./components/footer/Footer";
import Navigation from "./components/navbar/Navigation";
import About from "./pages/About/About";
import NoMatch from "./pages/NoMatch/NoMatch";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration"
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <><><Navigation />
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="*" element={<NoMatch />} />
      
      </Routes>
    
    </><Footer /></>
  );
}

export default App;
