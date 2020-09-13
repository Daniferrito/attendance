import React from "react";
import { Route } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import {
  Breadcrumbs,
  Typography,
  Link,
  LinkProps,
  makeStyles,
  Button,
} from "@material-ui/core";
import { User } from "firebase";
import fire from "../fire";

const breadcrumbNameMap: { [key: string]: string } = {
  teacher: "Teacher",
};

const mapToName = (key: string): string =>
  breadcrumbNameMap[key] || key.replace(/^\//, "");

interface LinkRouterProps extends LinkProps {
  to: string;
  replace?: boolean;
}

const LinkRouter = (props: LinkRouterProps) => (
  <Link {...props} component={RouterLink as any} />
);

interface MyBreadcrumbsProps {
  user: User | undefined;
}

const MyBreadcrumbs = (props: MyBreadcrumbsProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Route>
        {(location) => {
          const pathnames = location.location.pathname
            .split("/")
            .filter((x) => x);
          return (
            <Breadcrumbs aria-label="breadcrumb">
              <LinkRouter color="inherit" to="/">
                Home
              </LinkRouter>
              {pathnames.map((value, index) => {
                const last = index === pathnames.length - 1;
                const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                return last ? (
                  <Typography color="textPrimary" key={to}>
                    {mapToName(value)}
                  </Typography>
                ) : (
                  <LinkRouter color="inherit" to={to} key={to}>
                    {mapToName(value)}
                  </LinkRouter>
                );
              })}
            </Breadcrumbs>
          );
        }}
      </Route>
      {props.user ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => fire.auth().signOut()}
        >
          Logout
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    justifyContent: "space-between",
    display: "flex",
  },
}));

export default MyBreadcrumbs;
