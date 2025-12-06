import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { ArrowForward } from "@mui/icons-material";

const TableComponent = ({
  tbaEventMatchesData,
  teamInfo,
  scoutingData,
  selectedTeams,
  selectedMatches,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "grey.50" }}>
            {/* Match Number */}
            <TableCell align="center" sx={{ fontWeight: 500 }}>
              Match #
            </TableCell>

            {/* Red Alliance */}
            <TableCell
              align="center"
              sx={{ fontWeight: 500, borderLeft: "2px solid #e0e0e0" }}
            >
              Red 1
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 500 }}>
              Red 2
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 500 }}>
              Red 3
            </TableCell>

            {/* Blue Alliance */}
            <TableCell
              align="center"
              sx={{ fontWeight: 500, borderLeft: "2px solid #e0e0e0" }}
            >
              Blue 1
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 500 }}>
              Blue 2
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 500 }}>
              Blue 3
            </TableCell>

            {/* Scores */}
            <TableCell
              align="center"
              sx={{ fontWeight: 500, borderLeft: "2px solid #e0e0e0" }}
            >
              Red Score
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: 500 }}>
              Blue Score
            </TableCell>

            {/* Info */}
            <TableCell
              align="center"
              sx={{ fontWeight: 500, borderLeft: "2px solid #e0e0e0" }}
            >
              Info
            </TableCell>

            {/* Analysis */}
            <TableCell
              align="center"
              sx={{ fontWeight: 500, borderLeft: "2px solid #e0e0e0" }}
            >
              Analysis
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tbaEventMatchesData.map((row) => {
            if (selectedTeams.length > 0) {
              const redTeams = row.red.filter((team) =>
                selectedTeams.includes(`${team} - ${teamInfo[team] || ""}`)
              );
              const blueTeams = row.blue.filter((team) =>
                selectedTeams.includes(`${team} - ${teamInfo[team] || ""}`)
              );
              if (redTeams.length === 0 && blueTeams.length === 0) {
                return null; // Skip this row if no teams match the filter
              }
            }
            if (
              selectedMatches.length > 0 &&
              !selectedMatches.includes(row.match)
            ) {
              return null; // Skip this row if the match is not selected
            }

            const redWins = row.redScore > row.blueScore;
            const blueWins = row.blueScore > row.redScore;

            return (
              <TableRow key={row.match}>
                <TableCell align="center">{row.match}</TableCell>

                {/* Red Alliance */}
                {row.red.map((team, i) => (
                  <TableCell
                    key={`red-${i}`}
                    align="center"
                    sx={{
                      borderLeft: i === 0 ? "2px solid #e0e0e0" : undefined,
                      textDecoration: "underline",
                      textDecorationColor: "#e57373",
                      textDecorationThickness: "3.5px",
                    }}
                  >
                    <Tooltip title={teamInfo[team] || ""} arrow>
                      <span style={{ cursor: "default" }}>{team}</span>
                    </Tooltip>
                  </TableCell>
                ))}

                {/* Blue Alliance */}
                {row.blue.map((team, i) => (
                  <TableCell
                    key={`blue-${i}`}
                    align="center"
                    sx={{
                      borderLeft: i === 0 ? "2px solid #e0e0e0" : undefined,
                      textDecoration: "underline",
                      textDecorationColor: "#64b5f6",
                      textDecorationThickness: "3.5px",
                    }}
                  >
                    <Tooltip title={teamInfo[team] || ""} arrow>
                      <span style={{ cursor: "default" }}>{team}</span>
                    </Tooltip>
                  </TableCell>
                ))}

                {/* Red Score */}
                <TableCell
                  align="center"
                  sx={{
                    borderLeft: "2px solid #e0e0e0",
                    color: redWins ? "#e57373" : "inherit",
                    fontWeight: redWins ? 600 : undefined,
                  }}
                >
                  {row.redScore}
                </TableCell>

                {/* Blue Score */}
                <TableCell
                  align="center"
                  sx={{
                    color: blueWins ? "#64b5f6" : "inherit",
                    fontWeight: blueWins ? 600 : undefined,
                  }}
                >
                  {row.blueScore}
                </TableCell>

                {/* Info */}
                <TableCell
                  align="center"
                  sx={{ borderLeft: "2px solid #e0e0e0" }}
                >
                  {(() => {
                    // Find missing teams for this match
                    const missingTeams = [];
                    [...row.red, ...row.blue].forEach((team) => {
                      const found = scoutingData.some((sd) => {
                        return (
                          sd.match_number == row.match &&
                          sd.team_number.toString() == team
                        );
                      });
                      if (!found) {
                        missingTeams.push(team);
                      }
                    });

                    const isFullyScouted = missingTeams.length === 0;


                    const tooltipText = isFullyScouted
                      ? `All teams in match scouted by ${row.scouted_by.join(
                          ", "
                        )}`
                      : `Missing: ${missingTeams.join(", ")}`;

                    return (
                      <Tooltip title={tooltipText} arrow>
                        <InfoOutlinedIcon
                          sx={{
                            cursor: "pointer",
                            color: isFullyScouted ? "#757575" : "error.main",
                          }}
                        />
                      </Tooltip>
                    );
                  })()}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ borderLeft: "2px solid #e0e0e0" }}
                >
                  <Button
                    variant="contained"
                    // color="error"
                    endIcon={<ArrowForward />}
                  >
                    Go
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
