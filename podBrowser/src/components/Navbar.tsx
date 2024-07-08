import { useSession } from "@inrupt/solid-ui-react";
import { AppBar, Avatar, Box, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUser } from "../solid/solidProfile";
import { useNavigate } from "react-router-dom";
import { User } from "../model/user";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import logo from "../resources/icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBar(): JSX.Element {

  const { session } = useSession();
  const [userProfile, setUserProfile] = useState<JSX.Element>();
  const navigate = useNavigate();

  useEffect(() => {
    getUser(session).then((user) => {
      setUserProfile(getProfileIcon(user));
    }).catch((error) => {
      console.error("Error al cargar el perfil");
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.info.isLoggedIn]);

  function home(){
    navigate("/");
  }

  function profile(){
    navigate("/profile");
  }

  function files(){
    navigate("/files");
  }

  function login(){
    navigate("/login");
  }

  function logout(){
    session.logout();
    navigate("/");
  }

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  function getNotLoggedNavbar(){
    return (
      <MenuItem onClick={login}>
        <Typography variant="h6" noWrap sx={{ p: 2 }}>Iniciar sessión</Typography>
      </MenuItem>
    )
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function getProfileIcon(user: User): JSX.Element{
    return(
      <div className="profileIcon">
        <MenuItem onClick={handleOpenUserMenu} style={{display: "flex", gap: "0.5em"}}>
          {user.getUsername()}
          {user.getPhoto() !== null? <Avatar alt="Image" src={user.getPhoto() || faUser.iconName} /> : <FontAwesomeIcon icon={faUser} />}
      </MenuItem>
      </div>
    );
  }

  function getLoggedNavbar(){
    return(
      <Box sx={{ flexGrow: 0 }}>
            {userProfile}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key="Perfil" onClick={() => {
                handleCloseUserMenu();
                profile();
              }}>
                <Typography>Perfil</Typography>
              </MenuItem>
              <MenuItem key="Archivos" onClick={() => {
                  handleCloseUserMenu();
                  files();
                }
              }>
                <Typography>Archivos</Typography>
              </MenuItem>
              <MenuItem key="Cerrar sesión" onClick={() => {
                  handleCloseUserMenu();
                  logout();
                }
              }>
                <Typography>Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
    );
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <img src={logo} alt="Logo" id="logo_img"></img>
        <Box display='flex' flexGrow={1}>
          <Typography variant="h6" noWrap sx={{ p: 2 }} style={{alignSelf: "center"}}>Navegador de pods de Solid</Typography>
          <MenuItem onClick={home}>
            <Typography variant="h6" noWrap sx={{ p: 2 }}>Inicio</Typography>
          </MenuItem>
        </Box>
        {session.info.isLoggedIn ? getLoggedNavbar() : getNotLoggedNavbar()}
      </Toolbar>
    </AppBar>
  )
}