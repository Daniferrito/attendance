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
        history.push(`/teacher/${trimmed}/addstudents`);
      }catch(error){
        alert(error);
      }
    }
  }

  return (
    <>
      <Typography variant="h4">Crear Grupo</Typography>
      <Typography variant="h6">Nombre:</Typography>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <Button variant="contained" onClick={onSubmitAdd}>
        Añadir
      </Button>
      <br/>
      <p><b>INSTRUCCIONES:</b><br/>
        Introduce el nombre del grupo y pulsa en AÑADIR. 
        <br/>
        Se recomienda usar como nombre de grupo un formato similar a "1A_física_P1". 
        Donde se indica el curso, el cuatrimestre, la asignatura, el tipo 
        (P-prácticas y T-teoría) y el número de grupo si hay más de unos.
        <br/>
        Por ejemplo, una asignatura con un grupo de teoría y dos grupos de prácticas 
        tendría que crear los grupos: 1A_física_T, 1A_física_P1 y 1A_física_P2.
      </p>
    </>
  );
};

export default CreateGroup;
