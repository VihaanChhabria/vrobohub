import { Paper, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const SearchComponent = ({ searchValue, setSearchValue }) => {
  const [gradientAngle, setGradientAngle] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientAngle((prev) => (prev + 2) % 360);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        padding: 4,
        width: "80%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        overflow: "visible", // allow the gradient to extend beyond edges
        backgroundColor: "rgba(255, 255, 255, 0.9)", // semi-transparent
        borderRadius: 2,
      }}
    >
      {/* Gradient background div */}
      <div
        style={{
          position: "absolute",
          top: -15,
          left: -15,
          right: -15,
          bottom: -15,
          background: `linear-gradient(${gradientAngle}deg, rgba(150, 0, 0, 0.55), rgba(0,0,150,0.55))`,
          filter: "blur(12px)",
          zIndex: -1,
          borderRadius: 16,
        }}
      />

      <Typography
        variant="h4"
        component="h1"
        fontWeight="bold"
        sx={{ textAlign: "center" }}
      >
        Search for an Event!
      </Typography>
      <TextField
        label="Event Name or Code"
        variant="outlined"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </Paper>
  );
};

export default SearchComponent;
