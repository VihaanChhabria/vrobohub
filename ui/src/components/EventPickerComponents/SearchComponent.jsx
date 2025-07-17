import { Paper, TextField, Typography } from "@mui/material";
import React from "react";

const SearchComponent = ({ searchValue, setSearchValue }) => {
  return (
    <Paper
      elevation={0}
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
