import { useSession } from "@inrupt/solid-ui-react";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function PodLogIn() {
  const { session } = useSession();
  const [podProvider, setPodProvider] = useState("");
  const [element, setElement] = useState<JSX.Element>();

  let podProviders = ["https://solidcommunity.net", "https://inrupt.net", "https://solidweb.org", "https://solidproject.org"];

  function login() {
    session.login({
                    oidcIssuer:podProvider,
                    redirectUrl: window.location.href
            }).catch((error) => {
              setElement(<Typography color="error">Se ha producido un error al iniciar sesión</Typography>);
            });
  }
  return (
    <div className="app-container">
      <div className="providers">
          <TextField value={podProvider} onChange={e => {
                setPodProvider(e.target.value);
              }}></TextField>
          {element}
          {podProviders.map((provider) => {
            return (
            <div>
              <Button onClick={() => setPodProvider(provider)}>
                {provider}
              </Button>
              <Divider />
            </div>
            );
          })}
      </div>
      <Button color="info" onClick={login}>
          Iniciar sesión
      </Button>
    </div>
  );
}