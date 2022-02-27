import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import Paper from "@mui/material/Paper";
import { grey } from "@mui/material/colors";
import Typography from "@mui/material/Typography";

const validationSchema = yup.object({
  title: yup
    .string("Enter title")
    .max(20, "title can be 20 chars max")
    .required("Title is required"),
  description: yup
    .string("Enter your password")
    .max(40, "Description can be 40 chars max, use detail for more."),
  detail: yup
    .string("Enter your password")
    .max(200, "Detail can be 200 chars max."),
});

const AddTodoForm = (props) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      detail: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      values = {
        ...values,
      };
      console.log(values);
      props.onSubmitHandler(values);
      formik.resetForm();
    },
  });

  return (
    <React.Fragment>
      <Typography gutterBottom variant="h4" component="h6">
        Add To-Do
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            width: "100vh",
          },
        }}
      >
        <Paper variant="outlined" sx={{ p: 3, backgroundColor: grey[900] }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              sx={{ input: { color: "white" }, mb: 4 }}
              id="title"
              fullWidth
              focused
              name="title"
              label="Title - 20 chars max"
              color="wh"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />

            <TextField
              sx={{ input: { color: "white" }, mb: 4 }}
              fullWidth
              focused
              id="description"
              name="description"
              label="Description - 40 chars max"
              type="description"
              color="wh"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />

            <TextField
              sx={{ input: { color: "white" }, mb: 3 }}
              fullWidth
              focused
              id="detail"
              label="Details - 200 chars max"
              color="wh"
              multiline
              rows={4}
              value={formik.values.detail}
              onChange={formik.handleChange}
              error={formik.touched.detail && Boolean(formik.errors.detail)}
              helperText={formik.touched.detail && formik.errors.detail}
            />
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Paper>
      </Box>
    </React.Fragment>
  );
};

export default AddTodoForm;
