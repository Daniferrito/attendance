import React from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Group from "../types/Group";
import fire from "../fire";
import partition from "../utils/partition";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import Student from "../types/Student";

const TeacherSessionView = () => {
  const { course, session } = useParams();
  const [valueStudents, loadingStudents, errorStudents] = useCollectionData<
    Student
  >(fire.firestore().collection(`grupos/${course}/alumnos`), {
    idField: "id",
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  const [
    valueAttendance,
    loadingAttendance,
    errorAttendance,
  ] = useCollectionData<Student>(
    fire.firestore().collection(`grupos/${course}/sesiones/${session}/asisten`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const [valueGroup, loadingGroup, errorGroup] = useDocumentData<Group>(
    fire.firestore().doc(`grupos/${course}`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (
    loadingStudents ||
    loadingAttendance ||
    loadingGroup ||
    valueStudents == null ||
    valueGroup == null
  ) {
    return <div>"Still loading groups"</div>;
  }

  if (errorStudents || errorAttendance || errorGroup) {
    return (
      <div>{`Found error: ${
        errorStudents || errorAttendance || errorGroup
      }`}</div>
    );
  }

  const [open, closed] = partition(
    valueStudents,
    (doc) => valueAttendance?.some((att) => doc.id === att.id) || false
  );

  const onStartSessionClick = () => {
    fire
      .firestore()
      .collection(`grupos`)
      .doc(course)
      .update({ sesion_activa: session });
  };

  const onEndSessionClick = () => {
    fire
      .firestore()
      .collection(`grupos`)
      .doc(course)
      .update({ sesion_activa: null });
  };

  return (
    <>
      {valueGroup.sesion_activa === session ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={onEndSessionClick}
        >
          End Session
        </Button>
      ) : valueGroup.sesion_activa === null ? (
        <Button
          variant="contained"
          color="primary"
          onClick={onStartSessionClick}
        >
          Start Session
        </Button>
      ) : (
        <></>
      )}
      <Typography variant="h5">Attending students ({open.length})</Typography>
      <List>
        {open.map((doc) => (
          <ListItem button>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h5">Missing students ({closed.length})</Typography>
      <List>
        {closed.map((doc) => (
          <ListItem button>
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TeacherSessionView;
