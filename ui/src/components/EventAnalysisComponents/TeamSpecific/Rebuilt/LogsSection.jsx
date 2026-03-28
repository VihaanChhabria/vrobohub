import React, { useMemo } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import DefenseTable from "./DefenseTable";
import ReliabilityTable from "./ReliabilityTable";

const LogsSection = ({ matchScoutingData }) => {
  const defenseRows = useMemo(
    () =>
      Array.isArray(matchScoutingData)
        ? matchScoutingData.filter((m) => m.playedDefense)
        : [],
    [matchScoutingData],
  );

  const reliabilityRows = useMemo(
    () =>
      Array.isArray(matchScoutingData)
        ? matchScoutingData.filter((m) => m.broken)
        : [],
    [matchScoutingData],
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Defense Log
          </Typography>
          <DefenseTable rows={defenseRows} />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: "100%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Reliability Log
          </Typography>
          <ReliabilityTable rows={reliabilityRows} />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LogsSection;
