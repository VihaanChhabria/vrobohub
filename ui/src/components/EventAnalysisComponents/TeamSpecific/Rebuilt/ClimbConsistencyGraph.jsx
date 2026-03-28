import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import { getClimbLevel } from "./rebuiltAnalyticsUtils";
import fetchTBA from "../../../../utils/fetchTBA";

const ClimbConsistencyGraph = ({
  matchScoutingData,
  selectedTeam,
  eventKey,
}) => {
  const [selectedLevels, setSelectedLevels] = useState(["1", "2", "3"]);
  const [tbaMatches, setTbaMatches] = useState(null);

  useEffect(() => {
    const loadTBAMatches = async () => {
      if (!selectedTeam || !eventKey) {
        setTbaMatches(null);
        return;
      }

      try {
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/team/frc${selectedTeam}/event/${eventKey}/matches`,
        );
        setTbaMatches(Array.isArray(data) ? data : null);
      } catch (error) {
        console.error("Failed to fetch TBA team event matches:", error);
        setTbaMatches(null);
      }
    };

    loadTBAMatches();
  }, [selectedTeam, eventKey]);

  const data = useMemo(() => {
    // Index scouting data by match number for this team to read climbFailed / intended climb.
    const scoutingByMatch =
      Array.isArray(matchScoutingData) && selectedTeam
        ? matchScoutingData.reduce((acc, m) => {
            const teamNum = Number(m.selectTeam);
            const matchNum = Number(m.matchNumber);
            if (
              !Number.isNaN(teamNum) &&
              !Number.isNaN(matchNum) &&
              teamNum === Number(selectedTeam)
            ) {
              acc[matchNum] = m;
            }
            return acc;
          }, {})
        : {};

    // Prefer TBA data when available.
    if (
      Array.isArray(tbaMatches) &&
      tbaMatches.length > 0 &&
      selectedTeam &&
      eventKey
    ) {
      const teamKey = `frc${selectedTeam}`;

      const points =
        tbaMatches
          ?.map((m) => {
            if (!m || !m.alliances) return null;

            const redKeys = m.alliances.red?.team_keys || [];
            const blueKeys = m.alliances.blue?.team_keys || [];

            let color = null;
            let index = -1;

            if (Array.isArray(redKeys)) {
              const i = redKeys.indexOf(teamKey);
              if (i !== -1) {
                color = "red";
                index = i;
              }
            }

            if (color == null && Array.isArray(blueKeys)) {
              const i = blueKeys.indexOf(teamKey);
              if (i !== -1) {
                color = "blue";
                index = i;
              }
            }

            if (color == null || index === -1) return null;

            const breakdown = m.score_breakdown?.[color];
            if (!breakdown) return null;

            const matchNumber =
              typeof m.match_number === "number"
                ? m.match_number
                : Number((m.key || "").split("_")[1]) || null;

            if (matchNumber == null) return null;

            const scouting = scoutingByMatch[Number(matchNumber)];
            const scoutingClimbFailed = Boolean(scouting?.climbFailed);
            const scoutingClimbPosition = scouting?.climbPosition ?? null;

            const robotField = `endgameRobot${index + 1}`;

            const tbaClimbLevel =
              breakdown[robotField] ?? breakdown.endgame ?? breakdown.climb ?? null;

            return {
              matchNumber,
              level: tbaClimbLevel,
              scoutingClimbFailed,
            };
          })
          .filter((p) => p && p.matchNumber != null) || [];

      if (!points.length) return null;

      const filtered = points.filter((p) => {
        if (p.level === 0) return true;
        return selectedLevels.includes(String(p.level));
      });

      if (filtered.length === 0) return null;

      const sorted = [...filtered].sort(
        (a, b) => Number(a.matchNumber) - Number(b.matchNumber),
      );

      const labels = sorted.map((p) => `Match ${p.matchNumber}`);
      const values = sorted.map((p) => p.level);
      const attemptValues = sorted.map((p) =>
        p.attemptedLevel != null ? p.attemptedLevel : null,
      );

      return {
        labels,
        datasets: [
          {
            label: "Climb Level",
            data: values,
            stepped: true,
            borderColor: "rgba(0, 90, 200, 0.9)",
            backgroundColor: "rgba(0, 90, 200, 0.2)",
            pointRadius: 4,
            fill: false,
          },
          {
            label: "Failed Climb Attempt",
            data: attemptValues,
            stepped: true,
            borderColor: "rgba(0, 90, 200, 0.4)",
            backgroundColor: "rgba(0, 90, 200, 0.1)",
            pointRadius: 4,
            fill: false,
            borderDash: [4, 4],
          },
        ],
      };
    }

    // Fallback: use local scouting data only.
    if (!Array.isArray(matchScoutingData) || matchScoutingData.length === 0) {
      return null;
    }

    const points = matchScoutingData
      .map((m) => {
        const climbFailed = Boolean(m.climbFailed);
        const climbPosition = m.climbPosition;
        const matchNumber = m.matchNumber;

        const level = getClimbLevel(climbPosition, climbFailed);
        const attemptedLevel =
          climbFailed && climbPosition
            ? getClimbLevel(climbPosition, false)
            : null;

        return {
          matchNumber,
          level,
          attemptedLevel,
        };
      })
      .filter((p) => p.matchNumber != null);

    if (points.length === 0) return null;

    const filtered = points.filter((p) => {
      if (p.level === 0) return true;
      return selectedLevels.includes(String(p.level));
    });

    if (filtered.length === 0) return null;

    const sorted = [...filtered].sort(
      (a, b) => Number(a.matchNumber) - Number(b.matchNumber),
    );

    const labels = sorted.map((p) => `Match ${p.matchNumber}`);
    const values = sorted.map((p) => p.level);
    const attemptValues = sorted.map((p) =>
      p.attemptedLevel != null ? p.attemptedLevel : null,
    );

    return {
      labels,
      datasets: [
        {
          label: "Climb Level",
          data: values,
          stepped: true,
          borderColor: "rgba(0, 90, 200, 0.9)",
          backgroundColor: "rgba(0, 90, 200, 0.2)",
          pointRadius: 4,
          fill: false,
        },
        {
          label: "Failed Climb Attempt",
          data: attemptValues,
          stepped: true,
          borderColor: "rgba(0, 90, 200, 0.4)",
          backgroundColor: "rgba(0, 90, 200, 0.1)",
          pointRadius: 4,
          fill: false,
          borderDash: [4, 4],
        },
      ],
    };
  }, [matchScoutingData, selectedLevels, tbaMatches, selectedTeam, eventKey]);

  if (!data) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Climb Consistency
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No climb data available for this team.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h6">Climb Consistency</Typography>
          <Typography variant="body2" color="text.secondary">
            Discrete climb level per match (0 = No Climb, 1–3 = L1–L3).
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={selectedLevels}
          onChange={(_, val) => {
            if (Array.isArray(val) && val.length > 0) {
              setSelectedLevels(val);
            }
          }}
          size="small"
        >
          <ToggleButton value="1">L1</ToggleButton>
          <ToggleButton value="2">L2</ToggleButton>
          <ToggleButton value="3">L3</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ height: 280 }}>
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => {
                    const level = ctx.parsed.y;
                    const label =
                      level === 0
                        ? "No Climb"
                        : level === 1
                          ? "L1"
                          : level === 2
                            ? "L2"
                            : "L3";
                    return `Climb: ${label}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Match" },
              },
              y: {
                beginAtZero: true,
                suggestedMax: 3.2,
                ticks: {
                  stepSize: 1,
                  callback: (value) => {
                    if (value === 0) return "No Climb";
                    if (value === 1) return "L1";
                    if (value === 2) return "L2";
                    if (value === 3) return "L3";
                    return "";
                  },
                },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default ClimbConsistencyGraph;
