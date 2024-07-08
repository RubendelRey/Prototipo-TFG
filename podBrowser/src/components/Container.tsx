import { LDP } from "@inrupt/vocab-common-rdf";
import { RdfTriplet } from "../model/rdfTriplet";
import File from "./File";

export interface ContainerProps {
    triplets: RdfTriplet[];
}

export default function Container(props: ContainerProps): JSX.Element {

    let triplets: RdfTriplet[] = props.triplets.filter((triplet: RdfTriplet) => triplet.getPredicate() === LDP.contains);
    return (
        <div className="triplets">
            {triplets.map((triplet: RdfTriplet) => {
                return <File triplet={triplet} />;
            })}
        </div>
    );
}