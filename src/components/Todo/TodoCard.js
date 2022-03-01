import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { format } from "date-fns";
import { useHttpClient } from "../../hooks/http-hook";
import LoadingSpinner from "../LoadingSpinner";
import { AuthContext } from "../../context/auth-context";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function TodoCard(props) {
  const auth = React.useContext(AuthContext);
  const { isLoading, sendRequest } = useHttpClient();
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    deleteHandler();
    handleClose();
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const switchStateHandler = async (event) => {
    event.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/todo/changeState/${props.id}`,
        "POST",
        JSON.stringify({
          id: props.id,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      props.switchStateHandler(props.id);
      props.showSnackbar(
        props.isComplete
          ? "Item succesfully moved to ongoing"
          : "Item succesfully marked complete. Congrats!",
        props.isComplete ? "info" : "success"
      );
    } catch (err) {
      props.showSnackbar("Item state change failed :(", "warning");
    }
  };

  const deleteHandler = async (event) => {
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/todo/${props.id}`,
        "DELETE",
        {},
        { Authorization: "Bearer " + auth.token }
      );
      props.deleteHandler(props.id);
      props.showSnackbar("Item deleted", "info");
    } catch (err) {
      props.showSnackbar("Item deletion failed :(", "warning");
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Item?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="danger"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Card sx={{ mb: 2 }}>
        {isLoading && <LoadingSpinner asOverlay />}
        <CardHeader
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={props.title}
          subheader={`Created ${format(props.created, "MMMM do, yyyy H:mma")}`}
        />
        {props.description && (
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {props.description}
            </Typography>
          </CardContent>
        )}

        <CardActions disableSpacing>
          <IconButton
            onClick={switchStateHandler}
            aria-label={
              props.isComplete === false ? "markComplete" : "markOngoing"
            }
            title={
              props.isComplete === false
                ? "Mark as complete"
                : "Mark as ongoing"
            }
          >
            {props.isComplete === true ? <CloseIcon /> : <DoneIcon />}
          </IconButton>
          <IconButton aria-label="delete" onClick={handleClickOpen}>
            <DeleteIcon></DeleteIcon>
          </IconButton>
          {props.detail && (
            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </ExpandMore>
          )}
        </CardActions>
        {props.detail && (
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography>{props.detail}</Typography>
            </CardContent>
          </Collapse>
        )}
      </Card>
    </React.Fragment>
  );
}
