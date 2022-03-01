import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

const NotLoggedIn = () => {
  return (
    <Grid container sx={{ mt: 5 }}>
      <Grid item md={3}></Grid>
      <Grid item md={6} xs={12}>
        <Paper elevation={3} sx={{ p: 5, mx: 4 }}>
          <Typography variant="h4" component="h6" sx={{ textAlign: "center" }}>
            Just a simple to-do app. Nothing more.
          </Typography>
        </Paper>
        <Typography
          variant="h5"
          component="h6"
          sx={{ textAlign: "center", mt: 3 }}
        >
          Please login to proceed.
        </Typography>
      </Grid>
      <Grid item md={3}></Grid>
    </Grid>
  );
};

export default NotLoggedIn;
