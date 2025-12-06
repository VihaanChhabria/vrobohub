import React from "react";
import { Box } from "@mui/material";
import TeamSpecificLineChart from "./TeamSpecificLineChart";

const TeamSpecificOverTimeMetrics = ({ data, selectedTeam }) => {
  if (!data) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        alignItems: "center",
      }}
    >
      {/* Left column - 3 graphs */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <TeamSpecificLineChart
          title="Total Score Over Time"
          data={data.total}
          chartKey={`line-total-${selectedTeam}`}
        />
        <TeamSpecificLineChart
          title="Teleop Score Over Time"
          data={data.teleop}
          chartKey={`line-teleop-${selectedTeam}`}
        />
        <TeamSpecificLineChart
          title="Auto Score Over Time"
          data={data.auto}
          chartKey={`line-auto-${selectedTeam}`}
        />
      </Box>

      {/* Right column - 2 graphs, vertically centered */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          justifyContent: "center",
        }}
      >
        <TeamSpecificLineChart
          title="Algae Score Over Time"
          data={data.algae}
          chartKey={`line-algae-${selectedTeam}`}
        />
        <TeamSpecificLineChart
          title="Coral Score Over Time"
          data={data.coral}
          chartKey={`line-coral-${selectedTeam}`}
        />
      </Box>
    </Box>
  );
};

export default TeamSpecificOverTimeMetrics;

