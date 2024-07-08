import { useCookies } from "react-cookie";
import { useState } from "react";
import { useEffect } from "react";
import PatientInfo from "./PatientInfo";
import DoctorInfo from "./DoctorInfo";
import { User } from "../model/users";
import { getUser } from "../api/users";
import { Patient } from "../model/patient";
import { Doctor } from "../model/doctor";
import { getPatient } from "../api/patients";
import { getDoctor } from "../api/doctor";
import { Meeting } from "../model/meeting";
import { getMeetingsFor } from "../api/meetings";
import { getTreatments } from "../api/treatments";
import { CircularProgress, Typography } from "@mui/material";
import AdminPanel from "./AdminPanel";

export default function Profile(): JSX.Element {

    const [cookies, ] = useCookies(["user"]);
    const [element, setElement] = useState<JSX.Element>(<CircularProgress />);

    useEffect(() => {
        getUser(cookies.user).then((response) => {
            if (response !== null) {
                showUserInfo(response).then((element) => {
                    setElement(element);
                }).catch((error) => {
                });
            } else {
            }
        });
    }, [cookies.user]);

    return (
        <div>
            <Typography variant="h3" noWrap sx={{ p: 2 }}>Perfil del usuario</Typography>
            {element}
        </div>
    );
}

async function showUserInfo(user: User): Promise<JSX.Element> {
    let meetings: Meeting[] = [];
    switch (user.getRole()) {
        case "patient":
            let patient: Patient = await findPatient();
            meetings = await getMeetingsFor("patient");
            let treatments: any[] = await getTreatments();
            return <PatientInfo patient={patient} meetings={meetings} treatments={treatments} />;
        case "doctor":
            let doctor: Doctor = await findDoctor();
            meetings = await getMeetingsFor("doctor");
            return <DoctorInfo doctor = {doctor} meetings={meetings} />;
        case "admin":
            return <AdminPanel></AdminPanel>;
        default:
            throw new Error("Role not found");
    }
}

async function findPatient(): Promise<Patient> {
    return await getPatient();
}

async function findDoctor(): Promise<Doctor> {
    return await getDoctor();
}