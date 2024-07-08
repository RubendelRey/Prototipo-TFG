import { useSession } from "@inrupt/solid-ui-react";
import { RdfTriplet } from "../model/rdfTriplet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faAngleDown, faAngleRight, faDatabase, faFile, faFolder } from "@fortawesome/free-solid-svg-icons";
import { Button, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchContainer, isResourceContainer, isResourceFile } from "../solid/solidData";
import Container from "./Container";
import SolidFile from "./SolidFile";

export interface FileProps {
    triplet: RdfTriplet
}

export default function File(props: FileProps): JSX.Element {

    const { session } = useSession();
    const [show, setShow] = useState<boolean>(false);
    const [content, setContent] = useState<JSX.Element>(<CircularProgress />);
    const [icon, setIcon] = useState<IconDefinition>(faFile);

    useEffect(() => {
        loadFileElement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let triplet: RdfTriplet = props.triplet;
    let fileName: string = triplet.getObject().split(session.info.webId?.split("profile")[0] as string)[1];
    let showFileName: string = fileName.split("/").pop() as string;
    if (showFileName === "") {
        showFileName = fileName.split("/").slice(-2)[0];
    }

    function loadFileElement(){
        isResourceFile(session, fileName).then((isFile: boolean) => {
            (isFile ? loadFile() : loadContent()).then((content: JSX.Element) => {
                setContent(content);
            });
        });
    }

    async function loadContent(): Promise<JSX.Element> {
        let isContainer = await isResourceContainer(session, fileName)
        return isContainer ? loadContainer() : loadResource();
    }
    
    async function loadContainer(): Promise<JSX.Element> {
        setIcon(faFolder);
        let triplets: RdfTriplet[] = await fetchContainer(session, fileName)
        return <Container triplets={triplets} />;
    }

    async function loadResource(): Promise<JSX.Element> {
        setIcon(faDatabase);
        return <SolidFile fileName={triplet.getObject()} />;
    }

    async function loadFile(): Promise<JSX.Element> {
        setIcon(faFile);
        return <iframe src={triplet.getObject()} title={fileName} className="files" id="myiframe"></iframe>;
    }

    return (
        <div>
            <div className="resource">
                <Button className="resourceButton" onClick={() => {setShow(!show)}}>
                    {show ? <FontAwesomeIcon icon={faAngleDown} /> : <FontAwesomeIcon icon={faAngleRight} />}
                </Button>
                <FontAwesomeIcon icon={icon} style={{alignSelf: "center"}}/>
                <p>{showFileName}</p>
            </div>
            {show ? content : null}
        </div>
        );
}