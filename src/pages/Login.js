import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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

const regValidationSchema = yup.object({
  email: yup
    .string("Please enter email")
    .email("Please enter a valid email")
    .required("Email is required"),
  name: yup.string("Please enter your name").required("Name is required"),
  password: yup
    .string("Enter your password")
    .min(8)
    .required("Password required."),
  password2: yup
    .string("Enter your password")
    .min(8)
    .required("Confirmation Password required."),
});

const Login = (props) => {
  const [snackMessage, setSnackMessage] = React.useState("");
  const [snackType, setSnackType] = React.useState("info");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const { isLoading, sendRequest } = useHttpClient();
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

  const registerFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
      password2: "",
      name: "",
    },
    validationSchema: regValidationSchema,
    onSubmit: (values) => {
      registerSubmitHandler(values);
    },
  });

  const authSubmitHandler = async (values) => {
    try {
      const responseData = await sendRequest(
        "https://simplefingtodo.herokuapp.com/v1/auth/login",
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

  const registerSubmitHandler = async (values) => {
    try {
      if (values.password !== values.password2) {
        throw Error("Passwords do not match.");
      } else {
        const responseData = await sendRequest(
          "https://simplefingtodo.herokuapp.com/v1/auth/register",
          "POST",
          JSON.stringify({
            email: values.email,
            password: values.password,
            name: values.name,
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
      }
    } catch (err) {
      showSnackbar(err.toString(), "warning");
    }
  };

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
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
        <Grid container spacing={2}>
          <Grid item sm={6} xs={12}>
            <Container maxWidth="xs">
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
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
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
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
                </Box>
              </Box>
            </Container>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Container maxWidth="xs">
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "primary" }}>
                  <LockOutlinedIcon />
                </Avatar>

                <Typography component="h1" variant="h5">
                  Register
                </Typography>
                <Box
                  component="form"
                  onSubmit={registerFormik.handleSubmit}
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
                    id="regEmail"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    focused
                    value={registerFormik.values.email}
                    onChange={registerFormik.handleChange}
                    error={
                      registerFormik.touched.email &&
                      Boolean(registerFormik.errors.email)
                    }
                    helperText={
                      registerFormik.touched.email &&
                      registerFormik.errors.email
                    }
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
                    id="regPassword"
                    autoComplete="current-password"
                    value={registerFormik.values.password}
                    onChange={registerFormik.handleChange}
                    error={
                      registerFormik.touched.password &&
                      Boolean(registerFormik.errors.password)
                    }
                    helperText={
                      registerFormik.touched.password &&
                      registerFormik.errors.password
                    }
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
                    name="password2"
                    label="Password confirmation"
                    type="password"
                    id="regPassword2"
                    value={registerFormik.values.password2}
                    onChange={registerFormik.handleChange}
                    error={
                      registerFormik.touched.password2 &&
                      Boolean(registerFormik.errors.password2)
                    }
                    helperText={
                      registerFormik.touched.password2 &&
                      registerFormik.errors.password2
                    }
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
                    name="name"
                    label="Name"
                    type="string"
                    id="name"
                    autoComplete="current-name"
                    value={registerFormik.values.name}
                    onChange={registerFormik.handleChange}
                    error={
                      registerFormik.touched.name &&
                      Boolean(registerFormik.errors.name)
                    }
                    helperText={
                      registerFormik.touched.name && registerFormik.errors.name
                    }
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Register
                  </Button>
                </Box>
              </Box>
            </Container>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

export default Login;
