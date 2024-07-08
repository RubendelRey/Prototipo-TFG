import { Button, CircularProgress, Divider, MenuItem, Select, TextField, Typography } from "@mui/material";
import { Request } from "../model/request";
import { RdfTriplet } from "../model/rdfTriplet";
import { useEffect, useState } from "react";
import { getSolidHistory } from "../api/pod";
import getTreatmentTypes from "../api/treatmentTypes";
import { Treatment } from "../model/treatment";
import { postTreatment } from "../api/treatments";
import { TreatmentStatus } from "../model/treatmentStatus";

export interface SolidFileProps {
    request: Request;
}

export default function SolidFile(props: SolidFileProps): JSX.Element {
    const [element, setElement] = useState<JSX.Element>();
    const [data, setData] = useState<JSX.Element>(<CircularProgress />);
    const [shape, setShape] = useState<JSX.Element>(<CircularProgress />);

    const [date, setDate] = useState<string>("");
    const [code, setCode] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [teeth, setTeeth] = useState<string>("");
    const [status, setStatus] = useState<TreatmentStatus>();

    const [addedTreatment, setAddedTreatment] = useState<JSX.Element>();
    
    const [menuItems, setMenuItems] = useState<JSX.Element[]>([]);
    const menuItemsStatus = [
        <MenuItem value={TreatmentStatus.Completed}>{TreatmentStatus.Completed}</MenuItem>,
        <MenuItem value={TreatmentStatus.Pending}>{TreatmentStatus.Pending}</MenuItem>
    ];

    function showElemment(element: JSX.Element){
        setElement(element);
    }
    
    function createTreatment(){
        let dateObj = new Date();
        let dateParts = date.split("/");
        dateObj.setFullYear(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
        
        let treatment: Treatment = new Treatment(
            props.request.getPatient().getId(),
            "", 
            dateObj, 
            code, 
            name, 
            teeth.split(","),
            status || TreatmentStatus.Completed
        );
        postTreatment(treatment).then((added) => {
            added ? addedTreatmentElement() : addedTreatmentErrorElement();
        }).catch((error) => {
            addedTreatmentErrorElement();
        });
    }

    function addedTreatmentElement(){
        setAddedTreatment(<Typography variant="button" color="green">Tratamiento añadido correctamente</Typography>);
    }

    function addedTreatmentErrorElement(){
        setAddedTreatment(<Typography variant="button" color="red">Error al añadir el tratamiento</Typography>);
    }

    function loadTreatmentTypes(){
        let types = getTreatmentTypes();
        types.then((treatmentTypes) => {
            let items: JSX.Element[] = [];
            treatmentTypes.forEach((treatmentType) => {
                items.push(<MenuItem value={[treatmentType.getCode(), treatmentType.getName()]}>{treatmentType.getName()}</MenuItem>);
            });
            setMenuItems(items);
        });
    }

    function handleChange(event: any) {
        setCode(event.target.value[0]);
        setName(event.target.value[1]);
    }

    function handleChangeStatus(event: any) {
        setStatus(event.target.value);
    }

    function filterBySubject(triplets: RdfTriplet[]): RdfTriplet[][]{
        let subjects: Set<string> = new Set(triplets.map((triplet: RdfTriplet) => triplet.getSubject()));
        let list: RdfTriplet[][] = [];
        subjects.forEach((object: string) => {
            list.push(triplets.filter((triplet: RdfTriplet) => triplet.getSubject() === object));
        });
        return list;
    }

    function isValidHttpUrl(urlString: string) {
        let url;
        
        try {
            url = new URL(urlString);
        } catch (_) {
            return false;  
        }

        return url.protocol === "http:" || url.protocol === "https:";
    }

    useEffect(() => {
        loadTreatmentTypes();
        getSolidHistory(props.request.getId()).then((result) => {
            let shape = result.shape;
            let triplets: RdfTriplet[] = result.data.map((element: any) => new RdfTriplet(element.subject, element.predicate, element.object));
            let list: RdfTriplet[][] = filterBySubject(triplets);
            setData(
                <div className="data">
                    <Typography variant="h5">Datos del paciente</Typography>
                    {list.map((triplets: RdfTriplet[]) => {
                        return (
                            <div>
                                <div className="triplets1">
                                    <a className="subject" href={triplets[0].getSubject()}>{triplets[0].getSubject().split("#").pop()?.split("/").pop()}</a>
                                    <div className="other">
                                        {triplets.map((triplet: RdfTriplet) => {
                                            return (
                                                <div className="triplets2">
                                                    <a className="predicate" href={triplet.getPredicate()}>{triplet.getPredicate().split("#").pop()?.split("/").pop()}</a>
                                                    {isValidHttpUrl(triplet.getObject()) ? <a className="object" href={triplet.getObject()}>{triplet.getObject().split("#").pop()?.split("/").pop()}</a> : <p className="object">{triplet.getObject()}</p>}
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
            setShape(
                <div className="shape">
                    <Typography variant="h5">Forma de los datos</Typography>
                    <pre className="shapeData">{shape}</pre>
                </div>
            );
            showElemment(data);
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div className="request">
        <div className="requestData">
            <div className="dataButtonsContainer">
                <Button className="dataButtons" onClick={() => showElemment(data)}>Mostrar datos</Button>
                <Button className="dataButtons" onClick={() => showElemment(shape)}>Mostrar estructura</Button>
            </div>
            {element}
        </div>
        <div className="treatmentDataForm">
            <Typography variant="h5">Añadir datos</Typography>
            <TextField className="treatmentDataFormItems" id="date" label="Fecha(dd/mm/yyyy)" variant="standard" onChange={e => {
                setDate(e.target.value);
              }}/>
            <Select className="treatmentDataFormItems" onChange={handleChange}>
                {menuItems}
            </Select>
            <TextField className="treatmentDataFormItems" id="teeth" label="Diente/s" variant="standard" onChange={e => {
                setTeeth(e.target.value);
              }}/>
            <Select className="treatmentDataFormItems" onChange={handleChangeStatus}>
                {menuItemsStatus}
            </Select>
            <Button className="treatmentDataFormItems" onClick={() => { createTreatment() }}>Añadir intervención</Button>
            {addedTreatment}
        </div>
    </div>;
}