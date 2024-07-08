import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from "@mui/material";
import { Doctor } from "../model/doctor";
import { Meeting } from "../model/meeting";
import MeetingTable from "./MeetingTable";

export interface PatientInfoProps {
    doctor: Doctor;
    meetings: Meeting[];
}

export default function PatientInfo(props: PatientInfoProps) {
    return (
        <div className="profile-container">
            <Typography variant="h4" noWrap sx={{ p: 2 }}>Datos del doctor</Typography>
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
                                <StyledTableCell>{props.doctor.getName()}</StyledTableCell>
                                <StyledTableCell>{props.doctor.getSurname()}</StyledTableCell>
                                <StyledTableCell>{props.doctor.getPhone()}</StyledTableCell>
                                <StyledTableCell>{props.doctor.getEmail()}</StyledTableCell>
                                <StyledTableCell>{props.doctor.getAddress()}</StyledTableCell>
                                <StyledTableCell>{dateToString(props.doctor.getBirthdate())}</StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            <MeetingTable meetings={props.meetings} />
        </div>
    );
}

function dateToString(date: Date): string {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
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