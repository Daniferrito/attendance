import React, { useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import fire from "../fire";
import { Typography, List, ListItem, ListItemText, Button, IconButton } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Teacher from "../types/Teacher";
import partition from "../utils/partition";

const AddTeachers = () => {
  const { group } = useParams<{group: string}>();
  const textAreaRef = useRef(null);
  const [listTeacher, loading, error] = useCollectionData<Teacher>(
    fire.firestore().collection(`profesores`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (loading || listTeacher == null) {
    return <div>"Cargando profesores."</div>;
  }
  if (error) {
    return <div>{`Found error: ${error}`}</div>;
  }
  const [sinPermiso, conPermiso] = partition(
    listTeacher,
    (doc) => doc.grupos.indexOf(group) == -1 
  );

  async function onSubmitAdd(userId: string ) {
    const docRef = fire.firestore().collection("profesores").doc(userId);
    const doc = (await docRef.get()).data() || {grupos: []};
    await docRef.update({grupos: [...doc.grupos, group]});
  }

  async function onSubmitRemove(userId: string ) {
    const docRef = fire.firestore().collection("profesores").doc(userId);
    const doc = (await docRef.get()).data() || {grupos: []};
    var newGrupos: string[] = doc.grupos;
    newGrupos = newGrupos.filter(e => e !== group);
    await docRef.update({grupos: newGrupos});
  }
  
  return (
    <>
      <Typography variant="h4">Gestión de acceso a {group}:</Typography>
      <Typography variant="h5">Profesores con permiso:</Typography>
      <List>
        {conPermiso.map((doc) => (
          <ListItem key={doc.id} button >
            <ListItemText primary={doc.nombre} 
               onClick={() => onSubmitRemove(doc.id)}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5">Profesores sin permiso:</Typography>
      <List>
        {sinPermiso.map((doc) => (
          <ListItem key={doc.id} button >
            <ListItemText primary={doc.nombre} 
            onClick={() => onSubmitAdd(doc.id)} />
          </ListItem>
        ))}
      </List>
      <br/>
      <p><b>INSTRUCCIONES:</b><br/>
      Pulsa sobre un profesor sin permiso para darle permiso. Pulsa sobre uno con permiso para quitárselo.
      </p>
    </>
  );
};

export default AddTeachers;
