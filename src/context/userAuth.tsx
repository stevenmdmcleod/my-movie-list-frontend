import React, { createContext, useEffect, useState } from "react";
import { User } from "../models/users";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from '../services/authService';
import axios from "axios";
import { toast } from "react-toastify";
import { decodeToken, userJwt } from "../utils/jwt";
import 'react-toastify/dist/ReactToastify.css';

type UserContextType = {
    user: User | null;
    token: string | null;
    registerUser: (email: string, username: string, password: string) => void;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
    isAdmin: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children } : Props) => {

    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if(user && token) {
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
        setIsReady(true);
    }, []);

    const registerUser = async (email: string, username: string, password: string) => {
        await registerAPI(email, username, password).then((res) => {
            if(res?.status === 201) {
              
              toast.success("Registration Successful!");
              navigate("/login");
            }
            else{
                toast.warning("Registration Failed!");
            }
        }).catch(() => toast.warning("Server error occured"));
    };

    const loginUser = async (username: string, password: string) => {
        await loginAPI(username, password).then((res) => {
            if(res?.status === 200) {
                const currentUser = decodeToken(res?.data.token) as userJwt;
                if(currentUser.isBanned){
                    toast.warning("Your account has been locked.");
                    toast.warning("Login Failed!");
                    return;
                }
                localStorage.setItem("token", res?.data.token);

                const userObj = {
                    username: res?.data.username,
                    email: res?.data.email,
              };
              localStorage.setItem("user", JSON.stringify(userObj));
              setToken(res?.data.token);
              setUser(userObj!);
              
              toast.success("Login Successful!");
              navigate("/"); 
              
                 
             
            }
            else{
                toast.warning("Login Failed!");
            }
        }).catch(() => toast.warning("Server error occured"));
    };

    const isLoggedIn = () => {
        return !!user;
    };

    const isAdmin = () => {
        const TOKEN = window.localStorage.getItem("token") || '';
        const user = decodeToken(TOKEN) as userJwt;

        if (user && user.isAdmin){
            return true;
        }
        return false;
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken("");
        navigate("/");
    }

    return (
        <UserContext.Provider value={{user, token, loginUser, registerUser, isLoggedIn, logout, isAdmin}}
        >
            {isReady ? children : null}
        </UserContext.Provider>
    )
};

export const useAuth = () => React.useContext(UserContext);

