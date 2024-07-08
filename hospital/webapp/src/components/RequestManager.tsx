import { Button, CircularProgress } from "@mui/material";
import { Request } from "../model/request";
import SolidFile from "./SolidFile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

export interface RequestManagerProps {
    request: Request;
}

export default function RequestManager(props: RequestManagerProps): JSX.Element {

    const [show, setShow] = useState<boolean>(false);
    const [data, setData] = useState<JSX.Element>(<CircularProgress />);

    let patient = props.request.getPatient();

    useEffect(() => {
        loadResource().then((resource: JSX.Element) => {
            setData(resource);
        }).catch((error) => {
            console.error(error);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadResource(): Promise<JSX.Element> {
        return <SolidFile request={props.request} />;
    }

    return <div>
            <div className="resource">
                <Button className="resourceButton" onClick={() => {setShow(!show)}}>
                    {show ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} />}
                </Button>
                <p>Petición del paciente {patient.getName() + " " + patient.getSurname()}</p>
            </div>
            {show ? data : null}
        </div>;
}