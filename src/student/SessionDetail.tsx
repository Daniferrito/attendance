import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import fire from "../fire";
import { TextField, makeStyles, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Student from "../types/Student";

interface SessionDetailsProps { }

const nombreAlumnoKey = "nombreAlumno";

const SessionDetails = (props: SessionDetailsProps) => {
  const classes = useStyles();
  const { course, session } = useParams();
  const [chosenStudent, setChosenStudent] = useState(localStorage.getItem(nombreAlumnoKey) || undefined);
  const [sentState, setSentState] = useState(false);
  const [valueStudents, loadingStudents, errorStudents] = useCollectionData<Student>(
    fire.firestore().collection(`grupos/${course}/alumnos`
    ), {
    idField: "id",
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  if (loadingStudents || valueStudents == null) {
    return <div>"Cargando grupos"</div>;
  }

  if (errorStudents) {
    return <div>{`Found error: ${errorStudents}`}</div>;
  }

  const onSubmitStudent = () => {
    if (chosenStudent === undefined) return;
    localStorage.setItem(nombreAlumnoKey, chosenStudent);
    fire
      .firestore()
      .collection(`grupos/${course}/sesiones/${session}/asisten`)
      .doc(chosenStudent)
      .set({})
      .then(() => {
        setSentState(true);
      })
      .catch((err) => {
        console.warn(err);
        window.alert('Hay un problema al registrar tu nombre.');

      });
  };

  return (
    <>
      <br />
      <Autocomplete
        defaultValue={chosenStudent}
        options={valueStudents.map((student) => student.id)}
        getOptionLabel={(option) => option}
        className={classes.autocomplete}
        renderInput={(params) => (
          <TextField {...params} label="Selecciona tu nombre" variant="outlined" />
        )}
        onInputChange={(_, newStudent) => setChosenStudent(newStudent)}
      />
      <br />
      <Button
        variant="contained"
        color={sentState ? "primary" : "default"}
        disabled={chosenStudent === "" || sentState}
        onClick={onSubmitStudent}
      >
        {sentState ? "Ya has sido registrado" : "Asisto presencialmente"}
      </Button>
      <br />
      <p><b>IMPORTANTE:</b> Bajo ningún concepto se puede pulsar el botón si no es tu nombre el seleccionado o si no estás asistiendo de manera PRESENCIAL a la clase.</p>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  autocomplete: {
    width: 300,
    alignSelf: "center",
  },
}));

export default SessionDetails;
