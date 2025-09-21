import { useRoutes } from "react-router-dom";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotesPage from "../pages/NotesPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import AuthCheck from "../components/AuthCheck";
import RouteCheck from "../components/RouteCheck";

const commonRoute = [
  {
    path: "/",
    element: <RouteCheck />,
    children: [
      { path: "/", index: true, element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/verify-email", element: <VerifyEmailPage /> },
      { path: "/forgot-password", element: <ForgotPasswordPage /> },
      { path: "/reset-password", element: <ResetPasswordPage /> },
    ],
  },
];

const protectedRoute = [
  {
    path: "/notes",
    element: <AuthCheck />,
    children: [{ path: "/notes", index: true, element: <NotesPage /> }],
  },
];

const allRoutes = [...commonRoute, ...protectedRoute];

const Approute = () => {
  return useRoutes(allRoutes);
};

export default Approute;
