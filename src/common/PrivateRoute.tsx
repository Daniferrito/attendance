import React from "react";
import { Redirect, Route } from "react-router-dom";

interface PrivateRouteProps {
  user: firebase.User | undefined;
  loading: boolean;
  path: string;
  component: (props: any) => JSX.Element;
}

export interface LocationState {
  from: Location;
}

// @ts-ignore
const PrivateRoute = ({ component: Component, ...rest }) => {
  // Add your own authentication on the below line.
  const isLoggedIn = rest.user != null;

  if (rest.loading) {
    return <></>;
  }

  return (
    <Route
      {...rest}
      render={(routeProps) =>
        isLoggedIn ? (
          <Component {...routeProps} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: {
                from: (routeProps.location as unknown) as Location,
              } as LocationState,
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
