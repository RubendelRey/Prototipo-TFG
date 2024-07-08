import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { getImportDataRequests } from "../api/pod";
import { CircularProgress, Typography } from "@mui/material";
import { Request } from "../model/request";
import RequestManager from "./RequestManager";
import SolidLogIn from "./SolidLogIn";

export default function AdminPanel(): JSX.Element {

    const [cookies, ] = useCookies(["user", "solidSession"]);
    const [element, setElement] = useState<JSX.Element>(<CircularProgress />);

    useEffect(() => {
        if (cookies.solidSession) {
            showRequests();
        }
        else{
            showSolidLogin();
        }
    }, [cookies.solidSession]);
    
    function showRequests() {
        getImportDataRequests().then((requests) => {
            let requestsElements: JSX.Element[] = [];
            requests.forEach((request: Request) => {
                requestsElements.push(<RequestManager request={request} />);
            });
            setElement(<div>{requestsElements}</div>);
        }).catch((error) => {
            console.error(error);
        });
    }

    function showSolidLogin() {
        setElement(<SolidLogIn />);
    }

    return (
    <div>
        <Typography variant="h4" noWrap sx={{ p: 2 }}>Panel de administrador</Typography>
        {element}
    </div>);
}