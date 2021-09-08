import React from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Group from "../types/Group";
import fire from "../fire";
import partition from "../utils/partition";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";

const TeacherView = () => {
  const [value, loading, error] = useCollectionData<Group>(
    fire.firestore().collection("grupos"),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (loading || value == null) {
    return <div>"Still loading groups"</div>;
  }

  if (error) {
    return <div>{`Found error: ${error}`}</div>;
  }

  const [open, closed] = partition(value, (doc) => doc.sesion_activa != null);
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
