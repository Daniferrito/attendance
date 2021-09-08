import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import fire from "../fire";
import { useLocation, Redirect } from "react-router-dom";
import { LocationState } from "../common/PrivateRoute";

interface LoginScreenProps {
  user: firebase.User | undefined;
}

const LoginScreen = (props: LoginScreenProps) => {
  const location = useLocation<LocationState>();
  const prevPathname = location.state?.from?.pathname;
  if (prevPathname == null && props.user != null) {
    return <Redirect to={prevPathname || "/teacher"} />;
  }
  const uiConfig: firebaseui.auth.Config = {
    signInFlow: "popup",
    signInSuccessUrl: prevPathname || "/teacher",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    // callbacks: {
    //   signInSuccessWithAuthResult: (authResult) => {
    //     if(!authResult.additionalUserInfo.isNewUser) {
    //       return true;
    //     }
    //     // Habría que crear la regla en la base de datos
    //     const colleccion = fire.firestore().collection("profesores");
    //     colleccion.doc(authResult.user.uid).set({nombre: authResult.user.displayName});
    //     return false;
    //   }
    // },
  };
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={fire.auth()} />;
};

export default LoginScreen;
