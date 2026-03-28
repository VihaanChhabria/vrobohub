import React, { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  normalizeFuelPercent,
  classifyAction,
  DEFAULT_MAX_HOPPER_CAPACITY,
} from "./rebuiltAnalyticsUtils";

const FuelEfficiencyGraph = ({ matchScoutingData, pitRow }) => {
  const [mode, setMode] = useState("both");
  const [action, setAction] = useState("both");

  const maxHopperCapacity =
    pitRow && typeof pitRow.maxFuelStorage === "number"
      ? pitRow.maxFuelStorage
      : DEFAULT_MAX_HOPPER_CAPACITY;

  const chartData = useMemo(() => {
    if (!Array.isArray(matchScoutingData) || matchScoutingData.length === 0) {
      return null;
    }

    const totalsByMatch = new Map();

    matchScoutingData.forEach((m) => {
      const matchNumber = m.matchNumber;
      if (matchNumber == null) return;

      let total = 0;

      if (mode === "auto" || mode === "both") {
        if (Array.isArray(m.autoRobotPositions)) {
          m.autoRobotPositions.forEach((pos) => {
            const hopperPercent = pos?.shotInfo?.hopperPercent;
            const shotsPercent = pos?.shotInfo?.shotsPercent;
            if (hopperPercent == null || shotsPercent == null) return;
            const contribution =
              maxHopperCapacity * hopperPercent * shotsPercent;
            total += contribution;
          });
        }
      }

      if (mode === "teleop" || mode === "both") {
        if (Array.isArray(m.fuelShotAndSourceInfo)) {
          m.fuelShotAndSourceInfo.forEach((shot) => {
            const hopperPercent = shot?.hopperPercent;
            const shotsPercent = shot?.shotsPercent;
            if (hopperPercent == null || shotsPercent == null) return;
            const contribution =
              maxHopperCapacity * hopperPercent * shotsPercent;
            total += contribution;
          });
        }
      }

      totalsByMatch.set(matchNumber, total);
    });

    if (totalsByMatch.size === 0) return null;

    const sortedMatches = Array.from(totalsByMatch.keys()).sort(
      (a, b) => Number(a) - Number(b),
    );

    const labels = sortedMatches.map((m) => `Match ${m}`);
    const data = sortedMatches.map((m) => {
      const v = totalsByMatch.get(m) || 0;
      return Math.round(v * 10) / 10;
    });

    return {
      labels,
      datasets: [
        {
          label: "Total Fuel Shots",
          data,
          borderColor: "rgba(220, 0, 0, 0.9)",
          backgroundColor: "rgba(220, 0, 0, 0.3)",
          tension: 0.2,
          fill: true,
        },
      ],
    };
  }, [matchScoutingData, mode, action, maxHopperCapacity]);

  const modeLabel =
    mode === "both" ? "Auto + Teleop" : mode === "auto" ? "Auto" : "Teleop";

  if (!chartData) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Fuel Efficiency
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No fuel data available for this team.
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
          <Typography variant="h6">Fuel Efficiency</Typography>
          <Typography variant="body2" color="text.secondary">
            Estimated total fuel shots per match ({modeLabel}, hub vs shuttle
            filters).
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
          }}
        >
          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={(_, val) => {
              if (val !== null) setMode(val);
            }}
            size="small"
          >
            <ToggleButton value="auto">Auto</ToggleButton>
            <ToggleButton value="teleop">Teleop</ToggleButton>
            <ToggleButton value="both">Both</ToggleButton>
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={action}
            exclusive
            onChange={(_, val) => {
              if (val !== null) setAction(val);
            }}
            size="small"
          >
            <ToggleButton value="hub">Scoring in Hub</ToggleButton>
            <ToggleButton value="shuttle">Shuttling Fuel</ToggleButton>
            <ToggleButton value="both">Both</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Box sx={{ height: 320 }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    `Total Fuel Shots: ${ctx.parsed.y.toFixed(1)}`,
                },
              },
            },
            scales: {
              x: {
                title: { display: true, text: "Match" },
              },
              y: {
                beginAtZero: true,
                title: { display: true, text: "Total Fuel Shots" },
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default FuelEfficiencyGraph;
