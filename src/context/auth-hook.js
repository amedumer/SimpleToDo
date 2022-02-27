import { useState, useCallback, useEffect } from "react";
import { useHttpClient } from "../hooks/http-hook";

export const useAuth = () => {
  const [userId, setUserId] = useState(null);
  const [name, setName] = useState(null);
  const { sendRequest } = useHttpClient();

  const fetchAuthUser = async () => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/auth/user",
        "GET",
        null,
        {}
      );
      setUserId(responseData.googleId);
      setName(responseData.name);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGoogleLogin = async () => {
    let timer: NodeJS.Timeout | null = null;
    const googleLoginURL = process.env.REACT_APP_BACKEND_URL + "/login/google";

    const newWindow = await window.open(
      googleLoginURL,
      "_blank",
      "width=500,height=600"
    );

    if (newWindow) {
      timer = setInterval(() => {
        if (newWindow.closed) {
          fetchAuthUser();
          if (timer) {
            clearInterval(timer);
          }
        }
      }, 500);
    }
    return 1;
  };

  const login = useCallback(async () => {
    handleGoogleLogin();
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    //localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    fetchAuthUser();
  }, []);

  /*
  useEffect(() => {
    if (token) {
      const remainingTime = expireDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, expireDate]);

    useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));

    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token);
    }
  }, [login]);
*/

  return { login, logout, userId, name };
};
