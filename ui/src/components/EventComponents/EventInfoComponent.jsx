import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const EventInfoComponent = ({ matchData, eventName }) => {
  const navigate = useNavigate();
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
            {eventName ? eventName : "null"}
          </Typography>

          <Button
            variant="contained"
            color="error"
            startIcon={<ArrowBack />}
            onClick={() => {
              navigate("/")
            }}
          >
            Back
          </Button>
        </Box>

        <Typography variant="body1" color="text.secondary">
          Fetched {matchData.length} scouting records
        </Typography>
      </Box>
    </div>
  );
};

export default EventInfoComponent;
