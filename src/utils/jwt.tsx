import { jwtDecode, JwtPayload } from "jwt-decode";

export interface userJwt extends JwtPayload {
    isAdmin: boolean;
    isBanned: boolean;
    userId: string;
    username: string;
}

// Used for retrieving stored JWT info, doesn't validate
export function decodeToken(token: string): JwtPayload | null {
  try {
    if(!token || token.length === 0) return null;
    return jwtDecode<userJwt>(token);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// Used to protect routes by requiring a non-expired token
export function isTokenValid(token:string | null): boolean {
  if (!token) return false;
  try {
    const decoded: JwtPayload = jwtDecode(token);
    const currentTime = Math.floor(Date.now()/1000);
    
    if (!decoded.exp || decoded.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    console.log(error);
    return false
  }
}