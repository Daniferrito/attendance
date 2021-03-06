import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import fire from "../fire";
import { TextField, makeStyles, Button } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import Student from "../types/Student";

interface SessionDetailsProps {}

const SessionDetails = (props: SessionDetailsProps) => {
  const classes = useStyles();
  const { course, session } = useParams();
  const [chosenStudent, setChosenStudent] = useState("");
  const [sentState, setSentState] = useState(false);
  const [valueStudents, loadingStudents, errorStudents] = useCollectionData<
    Student
  >(fire.firestore().collection(`grupos/${course}/alumnos`), {
    idField: "id",
    snapshotListenOptions: { includeMetadataChanges: true },
  });
  if (loadingStudents || valueStudents == null) {
    return <div>"Still loading groups"</div>;
  }

  if (errorStudents) {
    return <div>{`Found error: ${errorStudents}`}</div>;
  }

  const onSubmitStudent = () => {
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
      });
  };

  return (
    <>
      <Autocomplete
        options={valueStudents}
        getOptionLabel={(option) => option.id}
        className={classes.autocomplete}
        renderInput={(params) => (
          <TextField {...params} label="Select your name" variant="outlined" />
        )}
        onInputChange={(_, newStudent) => setChosenStudent(newStudent)}
      />
      <Button
        variant="contained"
        color={sentState ? "primary" : "default"}
        disabled={chosenStudent === "" || sentState}
        onClick={onSubmitStudent}
      >
        {sentState ? "Already set as attending" : "Set as attending"}
      </Button>
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
