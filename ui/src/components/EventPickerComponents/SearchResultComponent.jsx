import { Add, ArrowForward } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import React from "react";

const SearchResultComponent = ({ scoutedEvents, searchValue }) => {
  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        height: "85%",
        width: "45vw",
        flexDirection: "column",
        gap: 2,
        padding: 2,
      }}
      elevation={5}
    >
      <Typography
        variant="h4"
        component="h1"
        fontWeight={"bold"}
        sx={{
          backgroundColor: "white",
          textAlign: "center",
        }}
      >
        Search Results:
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        {scoutedEvents.map((eventData, i) => {
          if (
            eventData.name.toLowerCase().includes(searchValue.toLowerCase()) ||
            eventData.event_key
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          ) {
            return (
              <Paper
                key={i}
                sx={{
                  paddingLeft: 2,
                  paddingRight: 2,
                  width: "80%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  },
                }}
              >
                <Box
                  sx={{
                    padding: 2,
                    width: "80%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h1"
                    fontWeight="bold"
                    sx={{ textAlign: "center" }}
                  >
                    {eventData.name}
                  </Typography>

                  <Typography variant="body1" sx={{ textAlign: "center" }}>
                    Scouted By {eventData.scouted_by.join(", ")}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                >
                  View Event
                </Button>
              </Paper>
            );
          }
        })}

        <Paper
          sx={{
            paddingLeft: 2,
            paddingRight: 2,
            width: "80%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.02)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            },
            cursor: "pointer",
            mb: 2,
            backgroundColor: "rgba(128, 0, 128, 0.25)",
          }}
        >
          <Box
            sx={{
              padding: 2,
              width: "80%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body1">Can't Find the Event?</Typography>
            <Typography variant="h5" component="h1" fontWeight="bold">
              Create a New Event
            </Typography>
          </Box>

          <Add sx={{ fontSize: 40 }} />
        </Paper>
      </Box>
    </Paper>
  );
};

export default SearchResultComponent;
