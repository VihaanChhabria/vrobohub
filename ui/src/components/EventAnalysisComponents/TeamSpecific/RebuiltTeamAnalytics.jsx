import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import "./Rebuilt/chartConfig";
import { getTeamPitRow } from "./Rebuilt/rebuiltAnalyticsUtils";
import FuelEfficiencyGraph from "./Rebuilt/FuelEfficiencyGraph";
import ClimbConsistencyGraph from "./Rebuilt/ClimbConsistencyGraph";
import ClimbDistributionRow from "./Rebuilt/ClimbDistributionRow";
import LogsSection from "./Rebuilt/LogsSection";

const RebuiltTeamAnalytics = ({
  selectedTeam,
  availableTeams,
  onTeamChange,
  scoutingData,
  teamRecord,
      teamInfo,
  tbaEventMatchesData,
      eventKey,
}) => {
  const matchData = scoutingData?.matchData || [];
  const pitData = scoutingData?.pitData || [];

  const teamMatches = useMemo(() => {
    if (!selectedTeam || !Array.isArray(matchData)) return [];
    const num = Number(selectedTeam);
    return matchData.filter((m) => Number(m.selectTeam) === num);
  }, [matchData, selectedTeam]);

  const pitRow = useMemo(
    () => getTeamPitRow(pitData, selectedTeam),
    [pitData, selectedTeam],
  );

  const teamLabel = selectedTeam
    ? `${selectedTeam} - ${teamInfo?.[Number(selectedTeam)] || ""}`.trim()
    : "Select a team";

  return (
    <Box sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: { xs: "flex-start", md: "space-between" },
          }}
        >
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: { xs: "flex-start", md: "flex-start" },
              flexGrow: 1.25,
              flexBasis: 0,
            }}
          >
            <Typography variant="h5" sx={{ mb: 1 }}>
              Rebuilt Team Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore match performance, climbs, and reliability for a robot.
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            <FormControl size="small" sx={{ minWidth: 220, width: "100%" }}>
              <InputLabel id="rebuilt-team-select-label">Team</InputLabel>
              <Select
                labelId="rebuilt-team-select-label"
                label="Team"
                value={selectedTeam ?? ""}
                onChange={(e) => onTeamChange(e.target.value || null)}
                fullWidth
              >
                {availableTeams.map((t) => (
                  <MenuItem key={t.value} value={t.value}>
                    {t.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              alignItems: "center",
              flexGrow: 1,
              flexBasis: 0,
            }}
          >
            {selectedTeam && (
              <Box
                sx={{ textAlign: { xs: "left", md: "right" }, width: "100%" }}
              >
                <Typography variant="subtitle2">{teamLabel}</Typography>
                <Typography variant="caption" color="text.secondary">
                  W-L-T: {teamRecord.wins}-{teamRecord.losses}-{teamRecord.ties}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>

      {!selectedTeam ? (
        <Paper sx={{ p: 3 }}>
          <Typography variant="body1">
            Select a team above to view Rebuilt analytics.
          </Typography>
        </Paper>
      ) : (
        <>
          <FuelEfficiencyGraph
            matchScoutingData={teamMatches}
            pitRow={pitRow}
          />
          <ClimbConsistencyGraph
            matchScoutingData={teamMatches}
            selectedTeam={selectedTeam}
            eventKey={eventKey}
          />
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Climb & Partner Distributions
            </Typography>
            <ClimbDistributionRow
              matchScoutingData={teamMatches}
              pitData={pitData}
              selectedTeam={selectedTeam}
              tbaEventMatchesData={tbaEventMatchesData}
            />
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Match Logs
            </Typography>
            <LogsSection matchScoutingData={teamMatches} />
          </Paper>
        </>
      )}
    </Box>
  );
};

export default RebuiltTeamAnalytics;
