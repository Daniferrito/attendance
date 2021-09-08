import React from "react";
import { useCollectionData, useDocumentData } from "react-firebase-hooks/firestore";
import Group from "../types/Group";
import fire from "../fire";
import partition from "../utils/partition";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import Teacher from "../types/Teacher";

const TeacherView = () => {
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
  const [open, closed] = partition(value.filter(it => teacher.grupos.map(gr=>gr.replace(/\s/g, "_")).includes(it.id)), (doc) => doc.sesion_activa != null);

  return (
    <>
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
    </>
  );
};

export default TeacherView;
