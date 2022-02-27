import { createTheme, ThemeProvider } from "@mui/material";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import React, { Suspense } from "react";
import MenuAppBar from "./components/Navbar";
//import MainPage from "./pages/Main";
//import NotLoggedIn from "./pages/NotLoggedIn";
//import LoginSuccess from "./pages/LoginSuccess";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./context/auth-hook";
import LoadingSpinner from "./components/LoadingSpinner";

const MainPage = React.lazy(() => import("./pages/Main"));
const NotLoggedIn = React.lazy(() => import("./pages/NotLoggedIn"));
const LoginSuccess = React.lazy(() => import("./pages/LoginSuccess"));

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#212121",
    },
    secondary: {
      main: "#9e9e9e",
    },
    wh: {
      main: "#fafafa",
    },
    info: {
      main: "#212121",
    },
    danger: {
      main: "#b71c1c",
    },
  },
});

function App() {
  const { login, logout, userId, name } = useAuth();
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!userId,
        login: login,
        logout: logout,
        name: name,
        userId: userId,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <Router>
          <MenuAppBar />
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner></LoadingSpinner>
              </div>
            }
          >
            <Switch>
              <Route
                path="/"
                exact
                component={userId !== null ? MainPage : NotLoggedIn}
              />
              <Route path="/loginSuccess" exact component={LoginSuccess} />
              <Redirect to="/" />
            </Switch>
          </Suspense>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
