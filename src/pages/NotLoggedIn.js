import React from "react";
import Typography from "@mui/material/Typography";

const NotLoggedIn = () => {
  return (
    <Typography
      variant="h2"
      component="div"
      sx={{
        flexGrow: 1,
        p: 5,
        textAlign: "center",
      }}
    >
      Not logged in!
    </Typography>
  );
};

export default NotLoggedIn;
