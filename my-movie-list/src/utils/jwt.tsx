import { jwtDecode, JwtPayload } from "jwt-decode";

export interface userJwt extends JwtPayload {
    isAdmin: boolean;
    isBanned: boolean;
    userId: string;
    username: string;
}

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<userJwt>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};