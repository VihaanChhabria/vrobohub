import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const EventInfoComponent = ({ matchData, selectedEvent }) => {
  return (
    <div>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            {selectedEvent ? selectedEvent : "null"}
          </Typography>

          <Button
            variant="contained"
            color="error"
            startIcon={<ArrowBack />}
            onClick={() => {
              // TODO: implement going to event selection page
            }}
          >
            Back
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary">
          Viewing {matchData.length} records
        </Typography>
      </Box>
    </div>
  );
};

export default EventInfoComponent;
