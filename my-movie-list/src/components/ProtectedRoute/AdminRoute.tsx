import { Navigate, Outlet } from "react-router-dom";

const AdminRoute: React.FC = () => {
  const userStr = localStorage.getItem("activeUser");
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AdminRoute;
