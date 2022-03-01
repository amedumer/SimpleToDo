import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import Container from "@mui/material/Container";
import { useHttpClient } from "../hooks/http-hook";
import { AuthContext } from "../context/auth-context";
import LoadingSpinner from "../components/LoadingSpinner";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
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

const validationSchema = yup.object({
  email: yup
    .string("Please enter email")
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8)
    .required("Password required."),
});

const Login = (props) => {
  const [snackMessage, setSnackMessage] = React.useState("");
  const [snackType, setSnackType] = React.useState("info");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const { isLoading, error, sendRequest } = useHttpClient();
  const auth = React.useContext(AuthContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, type) => {
    setSnackMessage(message);
    setSnackType(type);
    setSnackbarOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      authSubmitHandler(values);
    },
  });

  const authSubmitHandler = async (values) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "auth/login",
        "POST",
        JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      auth.login(
        responseData.user.id,
        responseData.user.email,
        responseData.tokens.access.token,
        new Date(responseData.tokens.access.expires)
      );
    } catch (err) {
      showSnackbar(err.toString(), "warning");
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && error && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={snackType}
            sx={{ width: "100%" }}
          >
            {snackMessage}
          </Alert>
        </Snackbar>
      )}
      {!isLoading && (
        <Container maxWidth="xs">
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              Register is not yet implemented, use test@test.com and test1234 as
              credentials.
            </Typography>
            <Avatar sx={{ m: 1, bgcolor: "primary" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              onSubmit={formik.handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                inputProps={{
                  style: {
                    color: "black",
                  },
                }}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                focused
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                inputProps={{
                  style: {
                    color: "black",
                    WebkitBoxShadow: "0 0 0 1000px white inset",
                  },
                }}
                margin="normal"
                required
                fullWidth
                focused
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />

              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2" color="secondary">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2" color="secondary">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      )}
    </React.Fragment>
  );
};

export default Login;
