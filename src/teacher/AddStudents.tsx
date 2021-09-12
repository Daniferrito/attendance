import React, { useRef } from "react";
import { useCollectionData } from "react-firebase-hooks/firestore";
import fire from "../fire";
import { Typography, List, ListItem, ListItemText, Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Session from "../types/Session";

const AddStudents = () => {
  const { group } = useParams<{group: string}>();
  const textAreaRef = useRef(null);
  const [value, loading, error] = useCollectionData<Session>(
    fire.firestore().collection(`grupos/${group}/alumnos`),
    {
      idField: "id",
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (loading || value == null) {
    return <div>"Cargando alumnos."</div>;
  }
  if (error) {
    return <div>{`Found error: ${error}`}</div>;
  }

  function onSubmitAdd() {
    const textArea = textAreaRef.current;
    if (textArea) {
      //@ts-ignore
      const valor:string = textArea.value;
      const alumnos = valor.split('\n').filter((x) => x);
      const coleccion = fire.firestore().collection(`grupos/${group}/alumnos`);
      alumnos.forEach ((alumno)=>{coleccion.doc(alumno).set({})});
    }
  }

  return (
    <>
      <Typography variant="h4">Gestión de alumnos en {group}:</Typography>
      <Typography variant="h6">Alumnos actuales: ({value.length})</Typography>
      <List>
        {value.map((doc) => (
          <ListItem key={doc.id} button >
            <ListItemText primary={doc.id} />
          </ListItem>
        ))}
      </List>
      <Typography variant="h6">Añadir alumnos:</Typography>
      <textarea
        ref={textAreaRef}
        //value={this.state.textAreaValue}
        rows={5}
      />
      <Button variant="contained" onClick={onSubmitAdd}>
        Añadir
      </Button>
      <Typography variant="inherit">INSTRUCCIONES:</Typography>
      <Typography variant="inherit">
      Si quieres añadir nuevos alumnos al grupo, escribe sus nombres en 
      el cuadro de texto (uno por línea) y pulsa en AÑADIR. 
      </Typography>
      <Typography variant="inherit">
      Para añadir un grupo de Poliformat:
      </Typography>
      <Typography variant="inherit">
      a) Entra en Poliformat / asignatura / Calificaciones / Importar/Exportar / Exportación personalizada / Seleccionar solo “Nombre de estudiante” e indicar “grupo”
      </Typography>
      <Typography variant="inherit">
      b) Abre la hoja de cálculo generada y seleccionar la primera columna desde la fila 2.
      </Typography>
      <Typography variant="inherit">
      c) Pegar la selección en el cuadro de texto.
      </Typography>

    </>
  );
};

export default AddStudents;
