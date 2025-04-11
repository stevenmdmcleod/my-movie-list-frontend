import { Navigate, Outlet } from "react-router-dom";
import { decodeToken, userJwt } from "../../utils/jwt";

const AdminRoute: React.FC = () => {
  const token = localStorage.getItem('token') || '';
  const user = decodeToken(token) as userJwt;

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
