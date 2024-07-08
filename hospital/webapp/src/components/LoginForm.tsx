import { useState } from "react";
import {useCookies} from "react-cookie"
import { login } from "../api/users";
import { Button, TextField } from "@mui/material";

export default function LogginForm(): JSX.Element {

    const [, setCookie] = useCookies(["user"]);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fail, setFail] = useState(false);

    async function logIn(username: string, password: string){
    login(username, password).then((response) => {
        if (response !== undefined) {
            setCookie("user", response);
            setFail(false);
        } else {
            setFail(true);
        }
    }).catch((error: any) => {
        setFail(true);
    });
}

    return (
    <div>
        <form className="login-form">
            <TextField id="username" label="Nombre de usuario" variant="standard" onChange={e => {
                setUsername(e.target.value);
              }}/>
            <TextField id="password" label="Contraseña" variant="standard" type="password" onChange={e => {
                setPassword(e.target.value);
              }}/>
            <Button onClick={ () => logIn(username, password)}>Iniciar sesión</Button>
        </form>
        {fail ? <div className="wrongLogIn">Usuario o contraseña inválida</div>: null}
    </div>);
}
