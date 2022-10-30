import React, { useMemo, useEffect, useState, createContext } from "react";
import { PropTypes } from "prop-types";
import apiClient from "src/helpers/axios/apiClient";
import getCommonOptions from "src/helpers/axios/getCommonOptions";

export const AuthContext = createContext({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  user: null,
  setUser: () => {},
});

const AuthContextProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  const loadAuthUser = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      setIsAuthenticated(false);
      return;
    }
    apiClient
      .get("/api/auth/users/me/", getCommonOptions())
      .then((res) => {
        setUser(res.data);
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  };

  const providerValue = useMemo(() => {
    return {
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
    };
  }, [isAuthenticated, setIsAuthenticated, user, setUser]);

  useEffect(() => {
    if (user === null && (isAuthenticated === null || isAuthenticated === true)) {
      loadAuthUser();
    }
  }, [user, isAuthenticated]);
  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContextProvider;
