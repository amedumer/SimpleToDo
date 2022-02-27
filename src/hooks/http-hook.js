import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      try {
        const httpAbortCrtl = new AbortController();
        activeHttpRequests.current.push(httpAbortCrtl);

        const response = await fetch(url, {
          method,
          body,
          headers,
          mode: "cors",
          signal: httpAbortCrtl.signal,
          credentials: "same-origin",
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtlr) => reqCtlr !== httpAbortCrtl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setIsLoading(false);

        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);

        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => {
        abortCtrl.abort();
      });
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
