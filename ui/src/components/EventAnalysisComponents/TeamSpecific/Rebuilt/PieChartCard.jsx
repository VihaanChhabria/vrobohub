import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Pie } from "react-chartjs-2";

const PieChartCard = ({ title, chartData, emptyMessage }) => {
  return (
    <Paper sx={{ p: 2, height: "100%" }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {chartData ? (
        <Box sx={{ height: 260 }}>
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
              },
            }}
          />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {emptyMessage}
        </Typography>
      )}
    </Paper>
  );
};

export default PieChartCard;
