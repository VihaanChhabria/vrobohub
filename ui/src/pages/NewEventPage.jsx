import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Stack,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import fetchTBA from "../utils/fetchTBA";
import {
  parseCsvFile,
  transformScoutingRows,
  buildTeamToMaxHopperSize,
} from "../utils/transformScoutingData";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const NewEventPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [pitFiles, setPitFiles] = useState(null);
  const [matchFiles, setMatchFiles] = useState(null);
  const [eventOptions, setEventOptions] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [processedPitData, setProcessedPitData] = useState([]);
  const [processedMatchData, setProcessedMatchData] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const currentYear = new Date().getFullYear();
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/events/${currentYear}/simple`
        );

        const options =
          data?.map((event) => ({
            key: event.key,
            label: `${event.year} ${event.name} (${event.key})`,
          })) ?? [];

        setEventOptions(options);
      } catch (error) {
        console.error("Failed to fetch events from TBA:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const processFiles = async () => {
      if (!pitFiles?.length && !matchFiles?.length) {
        setProcessedPitData([]);
        setProcessedMatchData([]);
        return;
      }

      let allPitRows = [];
      let allMatchRows = [];

      if (pitFiles?.length) {
        for (const file of pitFiles) {
          try {
            const rows = await parseCsvFile(file);
            allPitRows = allPitRows.concat(rows);
          } catch (err) {
            console.error("Failed to parse pit file:", file.name, err);
          }
        }
      }

      if (matchFiles?.length) {
        for (const file of matchFiles) {
          try {
            const rows = await parseCsvFile(file);
            allMatchRows = allMatchRows.concat(rows);
          } catch (err) {
            console.error("Failed to parse match file:", file.name, err);
          }
        }
      }

      const teamToMaxHopperSize = buildTeamToMaxHopperSize(allPitRows);
      setProcessedPitData(transformScoutingRows(allPitRows));
      setProcessedMatchData(
        transformScoutingRows(allMatchRows, { teamToMaxHopperSize })
      );
    };

    processFiles();
  }, [pitFiles, matchFiles]);

  const isSubmitEnabled =
    !!selectedEvent && pitFiles?.length > 0 && matchFiles?.length > 0;

  const handleSubmit = () => {
    const combined = {
      pitData: processedPitData,
      matchData: processedMatchData,
    };
    const blob = new Blob([JSON.stringify(combined, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `event-data-${selectedEvent?.key ?? "export"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        backgroundColor: "#f5f7fa",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 650,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h5" component="h1" fontWeight="bold" gutterBottom>
            Input the Following Data to Create an Event
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Select an event and upload the required scouting data to proceed.
          </Typography>
        </Box>

        <Autocomplete
          options={eventOptions}
          value={selectedEvent}
          onChange={(_, newValue) => setSelectedEvent(newValue)}
          getOptionLabel={(option) => option.label || ""}
          loading={isLoadingEvents}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Event Name or Key"
              placeholder="Search for an event..."
            />
          )}
        />

        <Divider>
          <Typography variant="caption" sx={{ color: "text.disabled", px: 1 }}>
            DATA UPLOAD
          </Typography>
        </Divider>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
          {/* Pit Scouting Section */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1.5, fontWeight: "bold" }}
            >
              Pit Scouting
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={
                pitFiles ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CloudUploadIcon />
                )
              }
              fullWidth
              sx={{
                py: 2,
                borderStyle: "dashed",
                borderWidth: 2,
                flexDirection: "column",
                gap: 1,
              }}
            >
              {pitFiles ? `${pitFiles.length} Files Selected` : "Upload Files"}
              <VisuallyHiddenInput
                type="file"
                multiple
                onChange={(e) => setPitFiles(e.target.files)}
              />
            </Button>
          </Box>

          {/* Match Scouting Section */}
          <Box sx={{ flex: 1, textAlign: "center" }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1.5, fontWeight: "bold" }}
            >
              Match Scouting
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={
                matchFiles ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <CloudUploadIcon />
                )
              }
              fullWidth
              sx={{
                py: 2,
                borderStyle: "dashed",
                borderWidth: 2,
                flexDirection: "column",
                gap: 1,
              }}
            >
              {matchFiles
                ? `${matchFiles.length} Files Selected`
                : "Upload Files"}
              <VisuallyHiddenInput
                type="file"
                multiple
                onChange={(e) => setMatchFiles(e.target.files)}
              />
            </Button>
          </Box>
        </Stack>

        <Button
          variant="contained"
          size="large"
          color="primary"
          disabled={!isSubmitEnabled}
          fullWidth
          onClick={handleSubmit}
          sx={{ mt: 2, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
        >
          Submit Event Data
        </Button>
      </Paper>
    </Box>
  );
};

export default NewEventPage;
