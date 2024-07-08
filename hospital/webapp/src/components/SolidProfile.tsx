import { Typography } from "@mui/material";
import { getSolidProfile } from "../api/pod";
import { SolidUser } from "../model/solidUser";
import { useState, useEffect } from "react";

export default function SolidProfile() {

    const[solidUser, setSolidUser] = useState<SolidUser | null>(null);

    useEffect(() => {
        getSolidProfile().then((solidUser: SolidUser) => {
            setSolidUser(solidUser);
        });
    }, []);

    return (<div>
        <Typography variant="h4" noWrap sx={{ p: 2 }}>Perfil del pod</Typography>
        <div>
            <img className="solidPhoto" src={solidUser?.getPhoto() || ""} alt="Foto de perfil" />
            <Typography variant="h6" noWrap sx={{ p: 2 }}>Nombre: {solidUser?.getUsername()}</Typography>
        </div>
    </div>);
}
