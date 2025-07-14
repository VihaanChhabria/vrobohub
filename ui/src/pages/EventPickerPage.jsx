import React from "react";
import vrobohubLogo from "../assets/vrobohub_logo.png";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add, ArrowForward } from "@mui/icons-material";

const EventPickerPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "25vh",
        }}
      >
        <img
          src={vrobohubLogo}
          alt="VRoboHub Logo"
          style={{ width: "auto", height: "75%" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "75vh",
          flexDirection: "row",
          gap: 2,
          width: "95vw",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "50vw",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Paper
            elevation={0} // turn off the default box‐shadow
            sx={{
              position: "relative",
              padding: 2,
              paddingBottom: 4,
              paddingTop: 4,
              width: "80%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              // create the gradient glow
              "&:before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                margin: -1.5,
                background:
                  "linear-gradient(45deg, rgba(255, 0, 0, 0.55), rgba(0, 0, 255, 0.55))",
                filter: "blur(8px)",
                zIndex: -1,
                borderRadius: 1,
              },
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="bold">
              Search for an Event!
            </Typography>
            <TextField label="Event Name or Code" variant="outlined" />
          </Paper>
        </Box>
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            height: "90%",
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
            {[...Array(5)].map((_, i) => (
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
                  <Typography variant="h5" component="h1" fontWeight="bold">
                    Event Name
                  </Typography>
                  {/* Placeholder for upcoming events list */}
                  <Typography variant="body1">Scouted By __</Typography>
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<ArrowForward />}
                >
                  View Event
                </Button>
              </Paper>
            ))}

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
      </Box>
    </Box>
  );
};

export default EventPickerPage;
