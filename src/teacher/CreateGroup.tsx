import React from "react";
import fire from "../fire";
import { Typography, Button, Input } from "@material-ui/core";
import { useHistory } from "react-router";


const CreateGroup = () => {
  const history = useHistory();
  const [name, setName] = React.useState("");

  async function onSubmitAdd() {
    const user = fire.auth().currentUser;
    const trimmed = name.trim();
    if (trimmed.length > 0 && user) {
      try{
        await fire.firestore().collection("grupos").doc(trimmed).set({sesion_activa: null})
        // Add the new group to the list of the user's groups
        const docRef = fire.firestore().collection("profesores").doc(user.uid);
        const doc = (await docRef.get()).data() || {grupos: []};
        await docRef.update({grupos: [...doc.grupos, trimmed]});
        history.push(`/teacher/${trimmed}/add`);
      }catch(error){
        alert(error);
      }
    }
  }

  return (
    <>
      <Typography variant="h6">Nombre:</Typography>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <Button variant="contained" onClick={onSubmitAdd}>
        Añadir
      </Button>
    </>
  );
};

export default CreateGroup;
