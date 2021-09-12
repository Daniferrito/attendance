import React from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import Group from "../types/Group";
import fire from "../fire";
import partition from "../utils/partition";
import { useHistory} from "react-router-dom";
import { Typography, List, ListItem, ListItemText, Button } from "@material-ui/core";
import Teacher from "../types/Teacher";

const TeacherView = () => {
  const history = useHistory();
  const [value, loading, error] = useCollectionData<Group>(
    fire.firestore().collection("grupos"),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const user = fire.auth().currentUser as firebase.User;
  const [teacher, loadingT, errorT] = useDocumentData<Teacher>(
    fire.firestore().doc(`profesores/${user.uid}`),
  )
  if (loading || value == null || loadingT || teacher == null) {
    return <div>"Still loading groups"</div>;
  }

  if (error) {
    return <div>{`Found error: ${error}`}</div>;
  }

  if (errorT) {
    return <div>{`Found error: ${errorT}`}</div>;
  }
  const [open, closed] = partition(value.filter(it => teacher.grupos.includes(it.id)), (doc) => doc.sesion_activa != null);

  return (
    <>
      <Typography variant="h4">Gestión de grupos</Typography>
      <Typography variant="h5">Grupos abiertos</Typography>
      <List>
        {open.map((doc) => (
          <ListItem
            key={doc.id}
            button
            component="a"
            href={`/teacher/${doc.id}/${doc.sesion_activa}`}
          >
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5">Grupos cerrados</Typography>
      <List>
        {closed.map((doc) => (
          <ListItem key={doc.id} button component="a" href={`/teacher/${doc.id}`}>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary"
          onClick={() => history.push(`/teacher/create`)}>
          Crear nuevo grupo
      </Button>
      <p><b>INSTRUCCIONES DE ESTA PÁGINA:</b><br/>
      Un grupo abierto es el que tiene una sesión abierta. Es decir, que permite a los alumnos registrarse. Recuerda cerrar las sesiones una vez pasado el tiempo suficiente para que los alumnos se apunten.
        <br/>
        Pulsa sobre uno de los grupos para pasar lista o gestionarlo.
        <br/>
        Pulsa sobre AÑADIR GRUPO para crear un nuevo grupo.
        <br/>
      </p>  
      <p>
      <a href="https://raw.githubusercontent.com/Daniferrito/attendance/master/INSTRUCCIONES.md">
        <b>INSTRUCCIONES GENERALES DE USOS:</b>
      </a>
      </p>

    </>
  );
};

export default TeacherView;
