import { useState } from "react";
import { Link } from "react-router-dom";
import { IUserModel, addUser, isUsernameExists } from "../../LocalStorage";
import "./Registration.css";

const Register = () => {
  const [data, setData] = useState<IUserModel>({
    name: "",
    username: "",
    password: "",
  });

  const [message, setMessage] = useState<string>("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.id;
    const value = event.target.value;
    setData({ ...data, [id]: value });
    setMessage("");
  };

  const resetData = () => {
    setData({
      name: "",
      username: "",
      password: "",
    });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (data.name == "" || data.username == "" || data.password == "") {
      setMessage("Please fill all the field");
      return;
    }

    if (isUsernameExists(data.username)) {
      setMessage("Registration failed. User already exists");
      return;
    }

    addUser(data);
    resetData();
    setMessage("User registered. Jump to Login page");
  };

  return (
    <div className="backdrop">
    <>
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={handleFormSubmit}>
        <h3>Register Here</h3>

        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          value={data.name}
          onChange={handleInputChange}
        />

        <label>Username</label>
        <input
          type="text"
          placeholder="Email"
          id="username"
          value={data.username}
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

        <button>Register</button>
        <div className="social">
          {message && <p>{message}</p>}
          <br />
          <h4>
            <Link to="/login">Login</Link>
          </h4>
        </div>
      </form>
    </>
    </div>
  );
};

export default Register;