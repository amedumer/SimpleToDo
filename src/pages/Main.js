import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TodoList from "../components/Todo/TodoList";
import AddTodoForm from "../components/Form";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useHttpClient } from "../hooks/http-hook";
import Typography from "@mui/material/Typography";
import { AuthContext } from "../context/auth-context";

import LoadingSpinner from "../components/LoadingSpinner";

const myList = [];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function MainPage() {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [todos, setTodos] = useState(myList);
  const [snackMessage, setSnackMessage] = useState("");
  const [snackType, setSnackType] = useState("info");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const auth = useContext(AuthContext);

  const switchStateHandler = (switchedPlaceId) => {
    setTodos((todos) =>
      todos.map((todo) => {
        if (todo.id === switchedPlaceId) {
          todo.isComplete = !todo.isComplete;
        }
        return todo;
      })
    );
  };

  const addTodoHandler = async (newTodo) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + "/todo",
        "POST",
        JSON.stringify({
          title: newTodo.title,
          description: newTodo.description,
          detail: newTodo.detail,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      responseData.todo.created = new Date(parseInt(responseData.todo.created));
      setTodos((oldTodo) => [responseData.todo, ...oldTodo]);
      showSnackbar("New To-Do created!", "success");
    } catch (err) {
      showSnackbar("Oh no! Something went wrong.", "warning");
    }
  };

  const deleteTodoHandler = (deletedTodoId) => {
    setTodos((todos) => todos.filter((todo) => todo.id !== deletedTodoId));
    showSnackbar("Item succesfully deleted.", "warning");
  };

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

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/todo/user/${auth.userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + auth.token }
        );
        responseData.todos = responseData.todos.reverse();
        setTodos(
          responseData.todos.map((todo) => {
            todo.created = new Date(parseInt(todo.created));
            return todo;
          })
        );
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchTodos();
  }, [sendRequest, auth.userId, auth.token]);
  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && error && (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3} sx={{ pt: 10 }}>
            <Typography variant="h4" component="h6">
              Could not connect to database.
            </Typography>
          </Grid>
        </Grid>
      )}
      {!isLoading && !error && (
        <Box sx={{ flexGrow: 1, m: 5 }}>
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
          <Grid container spacing={2}>
            <Grid item sm={4} xs={12}>
              <AddTodoForm onSubmitHandler={addTodoHandler}></AddTodoForm>
            </Grid>
            <Grid item sm={4} xs={12}>
              <TodoList
                list={todos.filter((todo) => todo.isComplete === false)}
                switchStateHandler={switchStateHandler}
                deleteHandler={deleteTodoHandler}
                snackHandler={showSnackbar}
                listTitle="Ongoing"
              />
            </Grid>
            <Grid item sm={4} xs={12}>
              <TodoList
                list={todos.filter((todo) => todo.isComplete === true)}
                switchStateHandler={switchStateHandler}
                deleteHandler={deleteTodoHandler}
                snackHandler={showSnackbar}
                listTitle="Completed"
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </React.Fragment>
  );
}
