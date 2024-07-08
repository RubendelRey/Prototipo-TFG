import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from "@mui/material";
import { Appointment } from "../model/appointment";

export interface AppointmentTableProps {
    appointments: Appointment[];
}

export default function AppointmentTable(props: AppointmentTableProps): JSX.Element {
    return (
        <div className="profile-container">
                    <Typography variant="h4" noWrap sx={{ p: 2 }}>Citas</Typography>
                    <TableContainer component={Paper} style={{width: "80%", alignSelf: "center"}}>
                        <Table sx={{ minWidth: 700 }}>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Fecha</StyledTableCell>
                                    <StyledTableCell>Hora</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.appointments.map((appointment) => (
                                    <StyledTableRow>
                                        <StyledTableCell>{dateToString(appointment.getDate())}</StyledTableCell>
                                        <StyledTableCell>{timeToString(appointment.getDate())}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
    );
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

function dateToString(date: Date): string {
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}

function timeToString(date: Date): string {
    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    if (date.getHours() < 10) {
        hours = "0" + hours;
    }
    if (date.getMinutes() < 10) {
        minutes = "0" + minutes;
    }
    return hours + ":" + minutes;
}