import { Button, Container, IconButton, Menu, MenuItem } from "@mui/material";
import logo from "../assets/file.svg";
import { useId, useState } from "react";
import {
  AccountBox,
  Logout,
  Menu as MenuIcon,
  PeopleAlt,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

export const AppBar = () => {
  const id = useId();
  const buttonId = `${id}-button`;
  const menuId = `${id}-menu`;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRedirectHome = () => {
    navigate(`/`);
  };

  const handleRedirectUsuarios = () => {
    navigate(`/usuarios`);
    handleClose();
  };

  const handleRedirectPerfil = () => {
    navigate("/perfil");
    handleClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div
      className="bg-[#19273150] sticky top-0 max-w-screen backdrop-blur-sm z-50"
      style={{ minHeight: "100px" }}
    >
      <Container
        maxWidth="lg"
        className="flex flex-row justify-between items-center"
      >
        <div
          className="flex flex-row items-center gap-4"
          onClick={handleRedirectHome}
        >
          <img src={logo} width="100px" />
          <b style={{ fontFamily: "Lora" }} className="text-2xl md:text-4xl">
            Sweet Track
          </b>
        </div>
        <div>
          <IconButton
            id={buttonId}
            aria-controls={open ? menuId : undefined}
            aria-haspopup="true"
            aria-expanded={open}
            color="secondary"
            onClick={handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id={menuId}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              list: {
                "aria-labelledby": buttonId,
              },
            }}
          >
            <MenuItem onClick={handleRedirectUsuarios}>
              <PeopleAlt className="text-white mr-2" />
              <span className="text-white">Usuários</span>
            </MenuItem>
            <MenuItem onClick={handleRedirectPerfil}>
              <AccountBox className="text-white mr-2" />
              <span className="text-white">Minha conta</span>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout className="text-red-400 mr-2" />
              <span className="text-red-400">Sair</span>
            </MenuItem>
          </Menu>
        </div>
      </Container>
    </div>
  );
};
