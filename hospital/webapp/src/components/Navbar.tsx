import logo from "../resources/logo.png";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Box, MenuItem, Typography, AppBar, Toolbar} from "@mui/material";

export default function NavBar(): JSX.Element {
  const [cookies, setCookies] = useCookies(["user", "solidSession"]);
  const navigate = useNavigate();

  function home(){
    navigate("/");
  }

  function profile(){
    navigate("/profile");
  }

  function login(){
    navigate("/login");
  }

  function logout(){
    setCookies("user", undefined)
    setCookies("solidSession", undefined)
    navigate("/");
  }

  function LoggedNavbar(cookies: any) {
    return (
      <Box display='flex'>
        <MenuItem onClick={profile}>
          <Typography variant="h6" noWrap sx={{ p: 2 }}>Perfil</Typography>
        </MenuItem>
        <MenuItem onClick={logout}>
          <Typography variant="h6" noWrap sx={{ p: 2 }}>Cerrar sesión</Typography>
        </MenuItem>
      </Box>
    );
}

function NotLoggedNavbar() {
    return (
    <MenuItem onClick={login}>
      <Typography variant="h6" noWrap sx={{ p: 2 }}>Iniciar sesión</Typography>
    </MenuItem>
  )
}

  return (
    <AppBar position="static">
      <Toolbar>
        <img src={logo} alt="Logo" id="logo_img"></img>
        <Box display='flex' flexGrow={1}>
          <Typography variant="h6" noWrap sx={{ p: 2 }} style={{alignSelf: "center"}}>Hospital</Typography>
          <MenuItem onClick={home}>
            <Typography variant="h6" noWrap sx={{ p: 2 }}>Inicio</Typography>
          </MenuItem>
          {cookies.user !== undefined ? <LoggedNavbar cookies = {cookies}/> : <NotLoggedNavbar />}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

