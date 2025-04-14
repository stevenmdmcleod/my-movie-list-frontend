import axios from "axios";
import { handleError } from "../helpers/errorHandling";
import { UserToken } from "../models/users";

//to be changed to .env or config file
const api = "http://localhost:3000";

export const loginAPI = async (username: string, password: string) => {
  try {
    const data = await axios.post<UserToken>(api + "/users/login", {
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const data = await axios.post<UserToken>(api + "/users/register", {
      email: email,
      username: username,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};