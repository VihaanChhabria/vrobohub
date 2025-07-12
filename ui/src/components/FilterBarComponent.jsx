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
} from "@mui/material";
import { Search, Download, Clear } from "@mui/icons-material";

const FilterBarComponent = () => {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          alignItems: "center",
          backgroundColor: "red",
        }}
      >
        
      </Box>
    </Paper>
  );
};

export default FilterBarComponent;
