import { Navigate } from "react-router-dom";
import { auth } from "../lib/auth";
import { Outlet } from "react-router-dom";

function AuthCheck() {
  if (auth.isAuthenticated()) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
}

export default AuthCheck;
