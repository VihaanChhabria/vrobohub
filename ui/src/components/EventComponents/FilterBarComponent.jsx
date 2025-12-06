import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Paper,
  Typography,
  InputAdornment,
  Autocomplete,
} from "@mui/material";
import { Download, Clear } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FilterBarComponent = ({
  eventKey,
  tbaEventMatchesData,
  teamInfo,
  selectedTeams,
  setSelectedTeams,
  selectedMatches,
  setSelectedMatches,
}) => {
  const navigate = useNavigate();

  const uniqueTeams = Array.from(
    new Set(
      tbaEventMatchesData.flatMap((match) => [...match.red, ...match.blue])
    )
  )
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((teamNum) => `${teamNum} - ${teamInfo[teamNum] || ""}`);

  const matches = tbaEventMatchesData.map((match) => match.match);

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl sx={{ minWidth: 300 }}>
          <Autocomplete
            multiple
            options={uniqueTeams}
            getOptionLabel={(option) => option.toString()}
            value={selectedTeams}
            onChange={(event, newValue) => setSelectedTeams(newValue)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter Teams"
                placeholder="Filter Teams"
              />
            )}
          />
        </FormControl>

        <FormControl sx={{ minWidth: 250 }}>
          <Autocomplete
            multiple
            options={matches}
            getOptionLabel={(option) => option.toString()}
            value={selectedMatches}
            onChange={(event, newValue) => setSelectedMatches(newValue)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filter Matches"
                placeholder="Filter Matches"
              />
            )}
          />
        </FormControl>

        <Box sx={{ display: "flex", gap: 1, ml: "auto" }}>
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={() => {
              setSelectedTeams([]);
              setSelectedMatches([]);
              toast.success("Filters cleared successfully!");
            }}
          >
            Clear Filters
          </Button>

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              // TODO: Implement export functionality
              navigate("/export/" + eventKey);
            }}
          >
            Export Data
          </Button>

          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={() => {
              // TODO: Implement export functionality
              navigate("/analysis/" + eventKey);
            }}
          >
            View Analysis
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FilterBarComponent;
