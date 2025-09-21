import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../lib/auth";

const RouteCheck = () => {
  if (auth.isAuthenticated()) {
    return <Navigate to="/notes" />;
  }

  return <Outlet />;
};

export default RouteCheck;
