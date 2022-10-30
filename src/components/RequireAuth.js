import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "src/context/AuthContextProvider";
const RequireAuth = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated === true) {
    return <Outlet />;
  }
  return <Navigate to="/auth/signin" />;
};

export default RequireAuth;
