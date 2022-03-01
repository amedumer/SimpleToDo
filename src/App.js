import { createTheme, ThemeProvider } from "@mui/material";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import Container from '@mui/material/Container';
import React, { Suspense } from "react";
import MenuAppBar from "./components/Navbar";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

//import MainPage from "./pages/Main";
//import NotLoggedIn from "./pages/NotLoggedIn";
//import LoginSuccess from "./pages/LoginSuccess";
import { AuthContext } from "./context/auth-context";
import { useAuth } from "./context/auth-hook";
import LoadingSpinner from "./components/LoadingSpinner";

const MainPage = React.lazy(() => import("./pages/Main"));
const NotLoggedIn = React.lazy(() => import("./pages/NotLoggedIn"));
const Login = React.lazy(() => import("./pages/Login"));

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
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          "&:-webkit-autofill": {
            "-webkit-box-shadow": "0 0 0 100px var(--primary-weak) inset",
            "-webkit-text-fill-color": "var(--text-primary)",
          },
        },
      },
    },
  },
});

function Copyright(props) {
  return (
    <Typography variant="body2" color="secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="">
        SFTD
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function App() {
  const { token, login, logout, userId, email } = useAuth();
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        email: email,
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
                component={
                  token !== null && userId !== null ? MainPage : NotLoggedIn
                }
              />
              {token == null && <Route path="/login" exact component={Login} />}

              <Redirect to="/" />
            </Switch>
          </Suspense>
                <Container >
      <Copyright sx={{ mt: 8, mb: 4 }} />

                </Container>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
