import React from "react";
import { Box, Typography } from "@mui/material";

const TeamStatsCards = ({ stats }) => {
  return (
    <Box sx={{ display: "flex", width: "100%", gap: 2 }}>
      {stats.map((stat) => (
        <Box
          key={stat.title}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#f5f5f5",
            borderRadius: 2,
            p: 2,
            minWidth: 0,
          }}
        >
          <Typography
            sx={{ fontWeight: 500, fontSize: "1.08rem", color: "#555" }}
          >
            {stat.title}
          </Typography>
          <Typography
            sx={{ fontWeight: 700, fontSize: "1.32rem", color: "#222" }}
          >
            {stat.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TeamStatsCards;

