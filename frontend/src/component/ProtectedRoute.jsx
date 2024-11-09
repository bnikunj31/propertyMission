// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import NotAuthorized from "./NotAuthorized";

const ProtectedRoute = ({ role, requiredRole, redirectTo, children }) => {
  return role === requiredRole ? children : <Navigate to={NotAuthorized} />;
};

export default ProtectedRoute;
