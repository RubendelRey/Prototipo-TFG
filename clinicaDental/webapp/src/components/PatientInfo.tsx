import { Appointment } from "../model/appointment";
import { Intervention } from "../model/intervention";
import { Patient } from "../model/patient";
import SolidLogIn from "./SolidLogIn";
import SolidExport from "./SolidOptions";
import { useCookies } from "react-cookie";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from "@mui/material";
import AppointmentTable from "./AppointmentTable";
import SolidProfile from "./SolidProfile";

export interface PatientInfoProps {
    patient: Patient;
    appointments: Appointment[];
    interventions: Intervention[];
}

export default function PatientInfo(props: PatientInfoProps): JSX.Element {

    const [cookies, ] = useCookies(["solidSession"]);

    function dateToString(date: Date): string {
        return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }

    return (
        <div className="profile-container">
            <div className="profile-container">
                <Typography variant="h4" noWrap sx={{ p: 2 }}>Datos del paciente</Typography>
                <TableContainer component={Paper} style={{width: "80%", alignSelf: "center"}}>
                    <Table sx={{ minWidth: 700 }}>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Nombre</StyledTableCell>
                                <StyledTableCell>Apellidos</StyledTableCell>
                                <StyledTableCell>Teléfono</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Dirección</StyledTableCell>
                                <StyledTableCell>Fecha de nacimiento</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell>{props.patient.getName()}</StyledTableCell>
                                <StyledTableCell>{props.patient.getSurname()}</StyledTableCell>
                                <StyledTableCell>{props.patient.getPhone()}</StyledTableCell>
                                <StyledTableCell>{props.patient.getEmail()}</StyledTableCell>
                                <StyledTableCell>{props.patient.getAddress()}</StyledTableCell>
                                <StyledTableCell>{dateToString(props.patient.getBirthdate())}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="tables">
                <div className="profile-container">
                    <Typography variant="h4" noWrap sx={{ p: 2 }}>Intervenciones</Typography>
                    <TableContainer component={Paper} style={{width: "80%", alignSelf: "center"}}>
                        <Table sx={{ minWidth: 700 }}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Fecha</StyledTableCell>
                                    <StyledTableCell>Piezas</StyledTableCell>
                                    <StyledTableCell>Código</StyledTableCell>
                                    <StyledTableCell>Nombre</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.interventions.map((intervention) => (
                                    <StyledTableRow>
                                        <StyledTableCell>{dateToString(intervention.getDate())}</StyledTableCell>
                                        <StyledTableCell>{intervention.getTeeth().toString()}</StyledTableCell>
                                        <StyledTableCell>{intervention.getCode()}</StyledTableCell>
                                        <StyledTableCell>{intervention.getName()}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <AppointmentTable appointments={props.appointments} />
            </div>
            {cookies.solidSession === true ? <SolidProfile /> : <SolidLogIn />}
            {cookies.solidSession === true ? <SolidExport /> : null}
        </div>
    );
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));