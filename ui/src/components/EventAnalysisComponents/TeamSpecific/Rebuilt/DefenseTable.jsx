import React from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const EMPTY_MESSAGE = "No matches with recorded defense.";

const DefenseTable = ({ rows = [], emptyMessage = EMPTY_MESSAGE }) => {
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
            <TableCell>Duration</TableCell>
            <TableCell>Skill Level</TableCell>
            <TableCell>Target Team #</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={`${row.matchNumber}-${idx}`}>
              <TableCell>{row.matchNumber}</TableCell>
              <TableCell>{row.defenseTime}</TableCell>
              <TableCell>{row.defenseSkill}</TableCell>
              <TableCell>{row.playedDefenseOn}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DefenseTable;
