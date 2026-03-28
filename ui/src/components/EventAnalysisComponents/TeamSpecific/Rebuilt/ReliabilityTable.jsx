import React from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const EMPTY_MESSAGE = "No matches with recorded breakdowns.";

const ReliabilityTable = ({ rows = [], emptyMessage = EMPTY_MESSAGE }) => {
  if (!rows.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Match #</TableCell>
            <TableCell>Downtime Duration</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={`${row.matchNumber}-${idx}`}>
              <TableCell>{row.matchNumber}</TableCell>
              <TableCell>{row.brokenDownTime}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReliabilityTable;
