import React from "react";
import fire from "../fire";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import partition from "../utils/partition";
import Group from "../types/Group";

interface MainViewProps {}

const MainView = (props: MainViewProps) => {
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
      <Typography variant="h5">Open courses</Typography>
      <List>
        {open.map((doc) => (
          <ListItem
            button
            component="a"
            href={`/${doc.id}/${doc.sesion_activa}`}
          >
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5">Closed courses</Typography>
      <List>
        {closed.map((doc) => (
          <ListItem button component="a" href={`/${doc.id}`}>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default MainView;
