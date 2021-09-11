import React from "react";
import { useParams } from "react-router-dom";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import fire from "../fire";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";
import partition from "../utils/partition";
import Group from "../types/Group";
import Session from "../types/Session";

interface CourseDetailsProps { }

const CourseDetails = (props: CourseDetailsProps) => {
  const { course } = useParams<{course: string}>();
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
    return <div>"Cargando grupos"</div>;
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
      <Typography variant="h5">Sesiones abiertas</Typography>
      <List>
        {open.map((doc) => (
          <ListItem key={doc.id} button component="a" href={`/${course}/${doc.id}`}>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5">Sesiones cerradas</Typography>
      <List>
        {closed.map((doc) => (
          <ListItem key={doc.id} button>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default CourseDetails;