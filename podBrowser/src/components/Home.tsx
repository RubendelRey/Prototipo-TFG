import { Typography } from "@mui/material";

export default function Home(): JSX.Element {
  return (
    <div>
      <Typography variant="h1" noWrap sx={{ p: 2 }}>Inicio</Typography>
      <Typography variant="h2" noWrap sx={{ p: 2 }}>¡Bienvenido al navegador de Pods!</Typography>
    </div>
  );
}