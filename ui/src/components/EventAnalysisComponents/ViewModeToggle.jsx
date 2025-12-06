import React from "react";
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";

const ViewModeToggle = ({ viewMode, onViewModeChange }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, width: "100%" }}>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(event, newValue) => {
          if (newValue !== null && newValue !== undefined) {
            onViewModeChange(newValue);
          }
        }}
        aria-label="view mode"
        fullWidth
      >
        <ToggleButton
          value="team-specific"
          aria-label="team specific"
          sx={{ flex: 1 }}
        >
          Team Specific
        </ToggleButton>
        <ToggleButton value="overall" aria-label="overall" sx={{ flex: 1 }}>
          Overall
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default ViewModeToggle;

