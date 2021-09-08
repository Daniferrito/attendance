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
  Button, IconButton, ListItemSecondaryAction
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import Student from "../types/Student";
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import OnlineIcon from '@material-ui/icons/Home';

const TeacherSessionView = () => {
  const { course, session } = useParams();
  const [valueStudents, loadingStudents, errorStudents] = useCollectionData<Student>(
    fire.firestore().collection(`grupos/${course}/alumnos`), {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  const [valueAttendance, loadingAttendance, errorAttendance] = useCollectionData<Student>(
    fire.firestore().collection(`grupos/${course}/sesiones/${session}/asisten`), {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  const [valueOnline, loadingOnline, errorOnline] = useCollectionData<Student>(
    fire.firestore().collection(`grupos/${course}/sesiones/${session}/online`), {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  const [valueGroup, loadingGroup, errorGroup] = useDocumentData<Group>(
    fire.firestore().doc(`grupos/${course}`),  {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    });
  if ( loadingStudents || loadingAttendance || loadingOnline || loadingGroup ||
       valueStudents == null || valueOnline == null || valueGroup == null ) {
    return <div>"Cargando grupos"</div>;
  }
  if (errorStudents || errorAttendance || errorOnline || errorGroup) {
    return (
      <div>
        {`Found error: ${errorStudents || errorAttendance || errorGroup}`}
      </div>
    );
  }

  const [asisten, noAsisten] = partition(
    valueStudents,
    (doc) => valueAttendance?.some((att) => doc.id === att.id) || false
  );

  const [online, falta] = partition(
    noAsisten,
    (doc) => valueOnline?.some((att) => doc.id === att.id) || false
  );

  function  onStartSessionClick() {
    fire.firestore()
      .collection(`grupos`).doc(course)
      .update({ sesion_activa: session });
  };

  function onEndSessionClick() {
    fire.firestore()
      .collection(`grupos`).doc(course)
      .update({ sesion_activa: null });
  };

  function deleteStudentAsist(id: string) {
    fire.firestore()
      .doc(`grupos/${course}/sesiones/${session}/asisten/${id}`)
      .delete();
  };

  function addStudentAsist(id: string) {
    fire.firestore()
      .doc(`grupos/${course}/sesiones/${session}/asisten/${id}`)
      .set({})
  }

  function deleteStudentOnline(id: string) {
    fire.firestore()
      .doc(`grupos/${course}/sesiones/${session}/online/${id}`)
      .delete();
  };

  function addStudentOnline(id: string) {
    fire.firestore()
      .doc(`grupos/${course}/sesiones/${session}/online/${id}`)
      .set({})
  }

  return (
    <>
      {valueGroup.sesion_activa === session ? (
        <Button variant="contained"
                color="secondary"
                onClick={onEndSessionClick}>
          End Session
        </Button>
      ) : valueGroup.sesion_activa === null ? (
        <Button variant="contained"
                color="primary"
                onClick={onStartSessionClick}>
          Start Session
        </Button>
      ) : (
            <></>
          )}
      <Typography variant="h5">Alumnos que asisten presencialmente ({asisten.length})</Typography>
      <List>
        {asisten.map((doc) => (
          <ListItem key={doc.id} button >
            <ListItemText primary={doc.id} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteStudentAsist(doc.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5">Alumnos que asisten online ({online.length})</Typography>
      <List>
        {online.map((doc) => (
          <ListItem key={doc.id} button >
            <ListItemText primary={doc.id} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={() => deleteStudentOnline(doc.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Typography variant="h5">Alumnos que no asisten ({falta.length})</Typography>
      <List>
        {falta.map((doc) => (
          <ListItem key={doc.id} button >
            <ListItemText primary={doc.id} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="online" onClick={() => addStudentOnline(doc.id)}>
                <OnlineIcon />
              </IconButton>
              <IconButton edge="end" aria-label="add" onClick={() => addStudentAsist(doc.id)}>
                <AddIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TeacherSessionView;