import { useSession } from "@inrupt/solid-ui-react";
import { useEffect, useState } from "react";
import { fetchContainer, isResourceContainer } from "../solid/solidData";
import { RdfTriplet } from "../model/rdfTriplet";
import { LDP } from "@inrupt/vocab-common-rdf";
import File from "./File";
import { Button, TextField } from "@mui/material";
import Container from "./Container";

export default function Files(): JSX.Element {

    const { session } = useSession();
    const [resource, setResource] = useState<string>("");
    const [element, setElement] = useState<JSX.Element | null>(null);

    useEffect(() => {
        let res = session.info.webId?.split("profile")[0];
        if (res !== undefined){
            setResource(res)
        }

        if (resource !== undefined && resource !== ""){
            searchResource();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e: any) => {
        e.preventDefault();
        setResource(e.target.value);
  };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function searchResource() {
        let fileName: string = resource.split(session.info.webId?.split("profile")[0] as string)[1];
        isResourceContainer(session, fileName).then(async (isContainer: boolean) => {
            let triplet: RdfTriplet = new RdfTriplet(resource, LDP.contains, "");
            setElement(isContainer ? await loadContainer(): <File triplet = {triplet}/>);
        }).catch((e) => {
            console.error(e);
        });
    }

    async function loadContainer(): Promise<JSX.Element> {
        let fileName: string = resource.split(session.info.webId?.split("profile")[0] as string)[1];
        let triplets: RdfTriplet[] = await fetchContainer(session, fileName)
        return <Container triplets={triplets}/>;
    }

    return (
        <div>
            <h1>Archivos</h1>
            <p>En esta sección podrás ver tus archivos y subir nuevos.</p>
            <TextField id="standard-basic" className="resourceBrowser" variant="standard" value={resource} onChange={handleChange}/>
            <Button onClick={searchResource}>Buscar</Button>
            {element}
        </div>
    );
}