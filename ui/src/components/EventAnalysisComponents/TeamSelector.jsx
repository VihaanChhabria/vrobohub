import React from "react";
import {
  Paper,
  FormControl,
  Autocomplete,
  TextField,
} from "@mui/material";

const TeamSelector = ({ availableTeams, selectedTeam, onTeamChange }) => {
  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <FormControl fullWidth>
        <Autocomplete
          options={availableTeams}
          getOptionLabel={(option) => option.label || ""}
          value={
            selectedTeam
              ? availableTeams.find((t) => t.value === selectedTeam)
              : null
          }
          onChange={(event, newValue) => {
            onTeamChange(newValue ? newValue.value : null);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Team"
              placeholder="Choose a team to analyze"
            />
          )}
        />
      </FormControl>
    </Paper>
  );
};

export default TeamSelector;

