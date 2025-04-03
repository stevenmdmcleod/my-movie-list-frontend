import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, updateActiveUser } from "../../LocalStorage";
import './Login.css';

interface ILoginModel {
  username: string;
  password: string;
}

const Login = () => {
  const [data, setData] = useState<ILoginModel>({ username: "", password: "" });
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setData({ ...data, [id]: value });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (data.username == "" || data.password == "") {
      alert("Please fill all the field");
      return;
    }

    const user = getUser(data.username, data.password);
    if (user == null) {
      alert("Username or password is incorrect");
      return;
    }

    updateActiveUser(user);
    navigate("/");
  };

  return (
    <div className="backdrop">
    <>

      <form onSubmit={handleFormSubmit}>
        <h3>Login Here</h3>

        <label>Username</label>
        <input
          type="text"
          placeholder="Email"
          value={data.username}
          id="username"
          onChange={handleInputChange}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={data.password}
          onChange={handleInputChange}
        />

        <button>Log In</button>
        <div className="social">
          <h4>
            <Link to="/register">Register</Link>
          </h4>
        </div>
      </form>
    </>
    </div>
  );
};

export default Login;