import React from "react";
import fire from "../fire";
import { Typography, Button, Input } from "@material-ui/core";
import { useHistory } from "react-router";


const CreateGroup = () => {
  const history = useHistory();
  const [name, setName] = React.useState("");

  async function onSubmitAdd() {
    const user = fire.auth().currentUser;
    if (name.length > 0 && user) {
      const p1 = fire.firestore().collection("grupos").doc(name).set({sesion_activa: null});
      // Add the new group to the list of the user's groups
      const docRef = fire.firestore().collection("profesores").doc(user.uid);
      const doc = await (await docRef.get()).data() || {grupos: []};
      const p2 = docRef.update({grupos: [...doc.grupos, name]});
      await Promise.all([p1, p2]);
      history.push(`/add/${name}`);
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
