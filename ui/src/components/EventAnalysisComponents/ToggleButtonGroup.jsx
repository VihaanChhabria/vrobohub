import React from "react";
import { Box, ToggleButtonGroup as MuiToggleButtonGroup, ToggleButton } from "@mui/material";

const ToggleButtonGroup = ({
  value,
  onChange,
  options,
  exclusive = true,
  fullWidth = true,
  ariaLabel,
}) => {
  const handleChange = (event, newValue) => {
    if (exclusive) {
      // Single select mode
      if (newValue !== null && newValue !== undefined) {
        onChange(newValue);
      }
    } else {
      // Multi-select mode - newValue is an array
      if (newValue !== null && newValue !== undefined) {
        onChange(newValue);
      } else {
        // If all are deselected, keep at least one selected or return empty array
        onChange([]);
      }
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, width: "100%" }}>
      <MuiToggleButtonGroup
        value={value}
        exclusive={exclusive}
        onChange={handleChange}
        aria-label={ariaLabel}
        fullWidth={fullWidth}
      >
        {options.map((option) => (
          <ToggleButton
            key={option.value}
            value={option.value}
            aria-label={option.ariaLabel || option.label}
            sx={{ flex: 1 }}
          >
            {option.label}
          </ToggleButton>
        ))}
      </MuiToggleButtonGroup>
    </Box>
  );
};

export default ToggleButtonGroup;

