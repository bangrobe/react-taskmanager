import React from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import { SnackbarProvider } from "notistack";
import Categories from "./pages/Categories";
import CategoryDetail from "./pages/Categories/CategoryDetail";

//Auth
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import AuthContextProvider from "./context/AuthContextProvider";
import RequireAuth from "./components/RequireAuth";
import RequireNotAuth from "./components/RequireNotAuth";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/Tasks/TaskDetail";
import Dashboard from "./pages/Dashboard";
import { HelmetProvider } from "react-helmet-async";
//Reset password
import RequestResetPassword from "./pages/auth/RequestResetPassword";
//Layout
import BaseLayout from "./components/BaseLayout";
const App = () => {
  const helmelContext = {};
  return (
    <div>
      <CssBaseline />
      <HelmetProvider context={helmelContext}>
        <AuthContextProvider>
          <SnackbarProvider>
            <Router>
              <Box
                sx={{
                  bgcolor: (theme) => theme.palette.background.default,
                  minHeight: "100vh",
                  width: "100%",
                }}
              >
                <Routes>
                  <Route element={<RequireAuth />}>
                    <Route element={<BaseLayout />}>
                      <Route path="/categories" element={<Categories />} />
                      <Route
                        path="/categories/create"
                        element={<CategoryDetail />}
                      />
                      <Route
                        path="/categories/edit/:id"
                        element={<CategoryDetail />}
                      />
                      <Route path="/tasks" element={<Tasks />} />
                      <Route path="/tasks/create" element={<TaskDetail />} />
                      <Route path="/tasks/edit/:id" element={<TaskDetail />} />
                      <Route path="/" element={<Dashboard />} />
                    </Route>
                  </Route>
                  <Route element={<RequireNotAuth />}>
                    <Route path="/auth/signup" element={<SignUp />} />
                    <Route path="/auth/signin" element={<SignIn />} />
                    <Route
                      path="/auth/reset-password"
                      element={<RequestResetPassword />}
                    />
                    <Route
                      path="/auth/password-reset/confirm/:uid/:token"
                      element={<RequestResetPassword />}
                    />
                  </Route>
                </Routes>
              </Box>
            </Router>
          </SnackbarProvider>
        </AuthContextProvider>
      </HelmetProvider>
    </div>
  );
};

export default App;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
