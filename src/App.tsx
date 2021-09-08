import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import fire from "./fire";
import { useAuthState } from "react-firebase-hooks/auth";
import MainView from "./student/MainView";
import Breadcrumbs from "./common/Breadcrumbs";
import {
  ThemeProvider,
  useMediaQuery,
  createMuiTheme,
  CssBaseline,
  Box,
  Paper,
  makeStyles,
} from "@material-ui/core";
import CourseDetails from "./student/CourseDetails";
import SessionDetails from "./student/SessionDetail";
import LoginScreen from "./teacher/LoginScreen";
import PrivateRoute from "./common/PrivateRoute";
import TeacherView from "./teacher/TeacherView";
import TeacherCourseView from "./teacher/TeacherCourseView";
import TeacherSessionView from "./teacher/TeacherSessionView";
import TeacherCourseAdd from "./teacher/TeacherCourseAdd";
import TeacherGroupAdd from "./teacher/TeacherGroupAdd";

function App() {
  const [user, loading] = useAuthState(fire.auth());

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={classes.root}>
        <Paper className={classes.paper}>
          <Router>
            <Breadcrumbs user={user} />
            <Switch>
              <Route path="/login">
                <LoginScreen user={user} />
              </Route>
              <PrivateRoute
                user={user}
                loading={loading}
                path="/teacher/:course/:session"
                component={TeacherSessionView}
              />
              <PrivateRoute
                user={user}
                loading={loading}
                path="/teacher/:course"
                component={TeacherCourseView}
              />
              <PrivateRoute
                user={user}
                loading={loading}
                path="/create"
                component={TeacherGroupAdd}
              />
              <PrivateRoute
                user={user}
                loading={loading}
                path="/add/:group"
                component={TeacherCourseAdd}
              />
              <PrivateRoute
                user={user}
                loading={loading}
                path="/teacher"
                component={TeacherView}
              />
              <Route path="/:course/:session">
                <SessionDetails />
              </Route>
              <Route path="/:course">
                <CourseDetails />
              </Route>
              <Route path="/">
                <MainView />
              </Route>
            </Switch>
          </Router>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "center",
    display: "flex",
  },
  paper: {
    width: "100%",
    maxWidth: 800,
    display: "flex",
    flexDirection: "column",
  },
}));

export default App;
