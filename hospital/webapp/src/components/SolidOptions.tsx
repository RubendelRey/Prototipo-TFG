import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import { exportDataToPod, requestImportDataFromPod } from "../api/pod";
import { useState } from "react";

export default function SolidOptions() {

    const [resource, setResource] = useState("hospital/datos");
    const [shape, setShape] = useState("hospital/shape");
    const [message, setMessage] = useState<JSX.Element>();

    return (
        <div>
            {message}
            <div className="solidForm">
                <div className="solidFormLeft">
                    <TextField id="resource" className="solidFormContainerItems" label="Ruta de los datos" variant="standard" value={resource} onChange={e => {
                    setResource(e.target.value);
                }}/>
                </div>
                <div className="solidFormRight">
                    <TextField id="shape" className="solidFormContainerItems" label="Ruta de la definición de los datos" variant="standard" value={shape} onChange={e => {
                    setShape(e.target.value);
                }}/>
                </div>
                <div className="solidFormLeft">
                    <Button onClick={() => {
                        setMessage(<CircularProgress />)
                        exportDataToPod(resource, shape).then((response) => {
                            let color = response === "Datos exportados correctamente" ? "green" : "red";
                            setMessage(<Typography variant="button" color={color}>{response}</Typography>);
                        });
                    }} className="botonIniciarSesionPods solidFormContainerItems">
                        <Typography variant="button" color="blue">Exportar datos a Pod</Typography>
                </Button>
                </div>
                <div className="solidFormRight">
                    <Button onClick={() => {
                        setMessage(<CircularProgress />)
                        requestImportDataFromPod(resource, shape).then((response) => {
                            let color = response === "Solicitud de importación de datos realizada correctamente" ? "green" : "red";
                            setMessage(<Typography variant="button" color={color}>{response}</Typography>);
                        });
                    }} className="botonIniciarSesionPods solidFormContainerItems">
                        <Typography variant="button" color="blue">Importar datos del Pod</Typography>
                </Button>
                </div>
            </div>
        </div>
    );
}