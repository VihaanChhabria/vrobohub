import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";

const LogInPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "85vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          width: "50vw",
        }}
      >
        <Typography variant="h2" gutterBottom textAlign={"center"}>
          Welcome to VRoboHub
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Please Log In to continue
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type="password"
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => alert("...")}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default LogInPage;
