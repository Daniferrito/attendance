import React from "react";
import fire from "../fire";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import partition from "../utils/partition";
import Group from "../types/Group";

interface MainViewProps { }

const MainView = () => {
  const [value, loading, error] = useCollectionData<Group>(
    fire.firestore().collection("grupos"),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (loading || value == null) {
    return <div>"Cargando grupos."</div>;
  }

  if (error) {
    return <div>{`Found error: ${error}`}</div>;
  }

  const [open] = partition(value, (doc) => doc.sesion_activa != null);

  if (open.length === 0) {
    return (
      <Typography variant="h5">No hay sesiones abiertas.</Typography>
    );
  } else {
    return (
      <>
        <Typography variant="h5">Selecciona el grupo al que asistes:</Typography>
        <List>
          {open.map((doc) => (
            <ListItem
              key={doc.id}
              button
              component="a"
              href={`/${doc.id}/${doc.sesion_activa}`}
            >
              <ListItemText primary={doc.id} />
            </ListItem>
          ))}
        </List>
      </>
    );
  }
};

export default MainView;
