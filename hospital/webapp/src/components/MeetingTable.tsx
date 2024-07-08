import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from "@mui/material";
import { Meeting } from "../model/meeting";

export interface MeetingTableProps {
    meetings: Meeting[];
}

export default function MeetingTable(props: MeetingTableProps): JSX.Element {
    return (
        <div className="profile-container">
                    <Typography variant="h4" noWrap sx={{ p: 2 }}>Citas</Typography>
                    <TableContainer component={Paper} style={{width: "80%", alignSelf: "center"}}>
                        <Table sx={{ minWidth: 700 }}>
                            <TableHead  className="tableHead">
                                <TableRow>
                                    <StyledTableCell>Fecha</StyledTableCell>
                                    <StyledTableCell>Hora</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.meetings.map((meeting) => (
                                    <StyledTableRow>
                                        <StyledTableCell>{dateToString(meeting.getDate())}</StyledTableCell>
                                        <StyledTableCell>{timeToString(meeting.getDate())}</StyledTableCell>
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
    backgroundColor: "gray"
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#333",
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