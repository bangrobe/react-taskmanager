import { useCallback, useState, useContext } from "react";
import apiClient from "src/helpers/axios/apiClient";
import { useSnackbar } from "notistack";
import formatHttpApiError from "src/helpers/formatHttpApiError";

import { AuthContext } from "src/context/AuthContextProvider";
import getCommonOptions from "src/helpers/axios/getCommonOptions";

export default function useRequestAuth() {
  //Manage state
  const [loading, setLoading] = useState(false);
  const [logoutPending, setLogoutPending] = useState(false);
  const [error, setError] = useState(null);
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  //Handle Request Error
  const handleRequestError = useCallback(
    (err) => {
      const formattedError = formatHttpApiError(err);
      setError(formattedError);
      enqueueSnackbar(formattedError);
      setLoading(false);
    },
    [enqueueSnackbar, setLoading, setError]
  );

  //Register function
  const register = useCallback(
    ({ username, email, password }, successCallback) => {
      setLoading(true);
      apiClient
        .post("/api/auth/users/", {
          username,
          email,
          password,
        })
        .then(() => {
          enqueueSnackbar(
            "Signup successfully, now you can sign in with your credentials"
          );
          setLoading(false);
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestError);
    },
    [enqueueSnackbar, handleRequestError, setLoading]
  );

  //Login function
  const login = useCallback(
    ({ username, password }, successCallback) => {
      setLoading(true);
      apiClient
        .post("/api/auth/token/login/", {
          username,
          password,
        })
        .then((res) => {
          const { auth_token } = res.data;
          localStorage.setItem("authToken", auth_token);
          enqueueSnackbar("Login successfully, redirecting to dashboard");
          setLoading(false);
          setIsAuthenticated(true);
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestError);
    },
    [setLoading, enqueueSnackbar, handleRequestError, setIsAuthenticated]
  );

  //Logout Function
  const logout = useCallback(() => {
    apiClient
      .post("/api/auth/token/logout/", null, getCommonOptions())
      .then(() => {
        localStorage.removeItem("authToken");
        setLogoutPending(true);
        setIsAuthenticated(false);
        setUser(null);
      })
      .catch((error) => {
        setLogoutPending(true);
        handleRequestError(error);
      });
  }, [setLogoutPending, setIsAuthenticated, handleRequestError, setUser]);

  /*** RESET PASSWORD ***/

  const requestResetPassword = useCallback(
    (email, successCallback) => {
      setLoading(true);
      apiClient
        .post("/api/auth/users/reset_password/", { email })
        .then(() => {
          setLoading(false);
          enqueueSnackbar(
            "Reset password link will be sent to the provided email"
          );
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestError);
    },
    [enqueueSnackbar, handleRequestError]
  );

  const resetPassword = useCallback(
    (data, successCallback) => {
      setLoading(true);
      apiClient
        .post("/api/auth/users/reset_password_confirm", data)
        .then(() => {
          enqueueSnackbar("Successfully updated password");
          setLoading(false);
          if (successCallback) {
            successCallback();
          }
        })
        .catch(handleRequestError);
    },
    [enqueueSnackbar, handleRequestError]
  );
  return {
    register,
    login,
    logout,
    requestResetPassword,
    resetPassword,
    loading,
    logoutPending,
    error,
  };
}
