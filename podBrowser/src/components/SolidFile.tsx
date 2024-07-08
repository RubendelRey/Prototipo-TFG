import { useEffect, useState } from "react";
import { fetchContainer } from "../solid/solidData";
import { useSession } from "@inrupt/solid-ui-react";
import { RdfTriplet } from "../model/rdfTriplet";
import { Divider, Typography } from "@mui/material";

export interface SolidFileProps {
    fileName: string
}

export default function SolidFile(props: SolidFileProps): JSX.Element {

    const { session } = useSession();
    const [element, setElement] = useState<JSX.Element>();

    let fileName: string = props.fileName.split(session.info.webId?.split("profile")[0] as string)[1];

    function filterBySubject(triplets: RdfTriplet[]): RdfTriplet[][]{
        let subjects: Set<string> = new Set(triplets.map((triplet: RdfTriplet) => triplet.getSubject()));
        let list: RdfTriplet[][] = [];
        subjects.forEach((subject: string) => {
            list.push(triplets.filter((triplet: RdfTriplet) => triplet.getSubject() === subject));
        });
        return list;
    }

    useEffect(() => {
        fetchContainer(session, fileName).then((triplets: RdfTriplet[]) => {
            let list: RdfTriplet[][] = filterBySubject(triplets);
            setElement(
                <div>
                    {list.map((triplets: RdfTriplet[]) => {
                        return (
                            <div>
                                <div className="triplets1">
                                    <div className="object">
                                        {<Typography variant="h6">
                                            <a href={triplets[0].getSubject()}>{triplets[0].getSubject().split("#").pop()?.split("/").pop()}</a>
                                        </Typography>}
                                    </div>
                                    <div>
                                        {triplets.map((triplet: RdfTriplet) => {
                                        return (
                                            <div className="triplets2">
                                                <div>
                                                    <Typography variant="h6">
                                                        <a href={triplet.getPredicate()}>{triplet.getPredicate().split("#").pop()?.split("/").pop()}</a>
                                                    </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="h6">{triplet.getObject()}</Typography>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <Divider />
                            </div>
                        );
                    })}
                </div>
            );
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div>{element}</div>;
}