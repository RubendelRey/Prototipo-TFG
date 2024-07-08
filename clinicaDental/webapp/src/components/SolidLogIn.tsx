import { useCookies } from "react-cookie";
import { isSolidLoggedIn, solidLogIn } from "../api/pod";
import { Button, TextField, Typography } from "@mui/material";

export default function SolidLogIn() {
    const [, setCookie] = useCookies(["solidSession"]);

    return (
        <div >
                <Typography variant="h4" noWrap sx={{ p: 2 }}>Iniciar sesión en Pod</Typography>
                <div className="iniciarSesionPod">
                    <TextField className="placeHolderIniciarSesionPods" id="podProvider" label="Proovedor de pods" variant="outlined" />
                </div>
                <Button onClick={() => {
                    solidLogIn((document.getElementById("podProvider") as HTMLInputElement).value).then(() => {
                        isSolidLoggedIn().then((result) => {
                            setCookie("solidSession", result);
                        });
                    });
                }} className="botonIniciarSesionPods">Iniciar sesión</Button>
            </div>
    );
}