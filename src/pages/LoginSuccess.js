import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";

const LoginSuccess = () => {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);
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
      Thanks for logging in!
    </Typography>
  );
};

export default LoginSuccess;
