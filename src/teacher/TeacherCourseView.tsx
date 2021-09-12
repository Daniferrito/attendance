import React, { useEffect, useState } from "react";
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Group from "../types/Group";
import fire from "../fire";
import partition from "../utils/partition";
import { Typography, List, ListItem, ListItemText, Button, TextField, makeStyles, Divider } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import Session from "../types/Session";

const TeacherCourseView = () => {
  const history = useHistory();
  const classes = useStyles();
  const { course } = useParams<{course: string}>();
  const [inputValue,setInputValue] = useState('');

  const [valueDoc, loadingDoc, errorDoc] = useDocumentData<Group>(
    fire.firestore().doc(`grupos/${course}`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [listaSesiones, loading, error] = useCollectionData<Session>(
    fire.firestore().collection(`grupos/${course}/sesiones`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  useEffect(()=>{ //Ejecuta lambda cuando cambia listaSesiones
    if(loading || loadingDoc || listaSesiones == null || valueDoc == null){
      return;
    }
    const nuevaSesion = aDosDigitos(listaSesiones.length + 1);
    const newDate = new Date();
    const dia = aDosDigitos(newDate.getDate());
    const mes = aDosDigitos(newDate.getMonth() + 1);
    const año = aDosDigitos(newDate.getFullYear() % 100);
    const hora = aDosDigitos(newDate.getHours());
    setInputValue(`${nuevaSesion}_${dia}-${mes}-${año}_${hora}:00`);
  }, [listaSesiones, loading, loadingDoc, valueDoc])


  if (loading || loadingDoc || listaSesiones == null || valueDoc == null) {
    return <div>"Cargando sesiones"</div>;
  }

  if (error || errorDoc) {
    return <div>{`Found error: ${error || errorDoc}`}</div>;
  }

  const [open, closed] = partition(
    listaSesiones,
    (doc) => doc.id === valueDoc.sesion_activa
  );

  function aDosDigitos(n:number) {
    const s = n.toString();
    if (s.length === 1) return '0'+s;
    else             return s;
  }

  function onSubmitAdd() {
    const coleccion = fire.firestore().collection(`grupos/${course}/sesiones`);
    coleccion.doc(inputValue).set({});
  }

  function sessionView(doc: Session){
    return (
    <ListItem key={doc.id} button component="a" href={`/teacher/${course}/${doc.id}`}>
      <ListItemText primary={doc.id} />
    </ListItem>
    )
  }

  return (
    <>
      <Typography variant="h4">Gestión del grupo {course}</Typography>
      <Typography variant="h5">Sesiones abiertas</Typography>
      <List>
        {open.map(sessionView)}
      </List>
      <Typography variant="h5">Sesiones cerradas</Typography>
      <List>
        {closed.map(sessionView)}
      </List>
      <div className={classes.inputLine}>
      <TextField className={classes.input}
        variant="outlined"
        value={inputValue}
        onChange={(e)=>setInputValue(e.target.value)}
      />
      <Button variant="contained" onClick={onSubmitAdd}>
        Añadir sesión
      </Button>
      </div>
      <Typography variant="h5">Herramientas:</Typography>
      <Button
          variant="contained"
          color="primary"
          onClick={() => history.push(`/teacher/${course}/addstudents`)}
        >
          Añadir nuevos estudiantes al grupo
        </Button>
        <Divider light />
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push(`/teacher/${course}/addteachers`)}
        >
          Permitir que otros profesores gestionen el grupo
        </Button>
        <Typography variant="inherit">INSTRUCCIONES:</Typography>
        <Typography variant="inherit">
          Una sesión abierta es la que permite a los alumnos registrarse. Recuerda cerrar las sesiones una vez pasado el tiempo suficiente para que los alumnos se apunten.
        </Typography>
        <Typography variant="inherit">
          Pulsa sobre una de las sesiones para pasar lista o gestionarla.
        </Typography>
        <Typography variant="inherit">
           Para crear una nueva sesión, introduce su nombre en el cuadro de texto y pulsa en “AÑADIR SESION”. Se propone un nombre con formato por NÚM.SESIÓN_FECHA_HORA. Pero puedes cambiarlo y usar los nombres de sesiones que prefieras.
        </Typography>
        <Typography variant="inherit">
           Con los botones de herramienta puedes añadir alumnos al grupo o permitir que otros profesores tengan acceso a este grupo.
        </Typography>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  inputLine: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  input: {
    flexGrow: 1,
  }
}));


export default TeacherCourseView;
