import React from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Group from "../types/Group";
import fire from "../fire";
import partition from "../utils/partition";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Session from "../types/Session";

const TeacherCourseView = () => {
  const { course } = useParams();
  const [valueDoc, loadingDoc, errorDoc] = useDocumentData<Group>(
    fire.firestore().doc(`grupos/${course}`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [value, loading, error] = useCollectionData<Session>(
    fire.firestore().collection(`grupos/${course}/sesiones`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (loading || loadingDoc || value == null || valueDoc == null) {
    return <div>"Still loading groups"</div>;
  }

  if (error || errorDoc) {
    return <div>{`Found error: ${error || errorDoc}`}</div>;
  }
  const [open, closed] = partition(
    value,
    (doc) => doc.id === valueDoc.sesion_activa
  );
  return (
    <>
      <Typography variant="h5">Open sessions</Typography>
      <List>
        {open.map((doc) => (
          <ListItem key={doc.id} button component="a" href={`/teacher/${course}/${doc.id}`}>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5">Closed sessions</Typography>
      <List>
        {closed.map((doc) => (
          <ListItem key={doc.id} button component="a" href={`/teacher/${course}/${doc.id}`}>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TeacherCourseView;
