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

const FilterBarComponent = ({
  matchData,
  selectedEvent,
  setSelectedEvent,
  selectedTeams,
  setSelectedTeams,
  selectedMatches,
  setSelectedMatches,
}) => {
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
        <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Event</InputLabel>
          <Select
            value={selectedEvent}
            label="Event"
            onChange={(e) => setSelectedEvent(e.target.value)}
          >
            {Array.from(new Set(matchData.map((match) => match.event_key))).map(
              (event) => (
                <MenuItem key={event} value={event}>
                  {event}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 300 }}>
          <Autocomplete
            multiple
            options={Array.from(
              new Set(matchData.map((match) => match.team_number))
            )}
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
            options={Array.from(
              new Set(matchData.map((match) => match.match_number))
            )}
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
              setSelectedEvent("");
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
            }}
          >
            Export Data
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default FilterBarComponent;
