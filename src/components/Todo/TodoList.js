import React from "react";
import TodoCard from "./TodoCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";

import "./TodoList.css";

const TodoList = (props) => {
  return (
    <React.Fragment>
      <Box sx={{ display: "flex" }}>
        <Typography variant="h4" component="h6">
          {props.listTitle}
        </Typography>
        {props.list.length !== 0 && (
          <Avatar sx={{ bgcolor: "primary", ml: 2 }} variant="rounded">
            <Typography variant="h6" component="h6" color="common.white">
              {props.list.length}
            </Typography>
          </Avatar>
        )}
      </Box>
      <ul className="todoList">
        {props.list.map((item) => (
          <TodoCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            detail={item.detail}
            isComplete={item.isComplete}
            switchStateHandler={props.switchStateHandler}
            deleteHandler={props.deleteHandler}
            showSnackbar={props.snackHandler}
            created={item.created}
          ></TodoCard>
        ))}
      </ul>
    </React.Fragment>
  );
};

export default TodoList;
