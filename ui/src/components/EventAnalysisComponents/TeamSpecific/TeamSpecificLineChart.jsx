import React, { useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { 
  Chart as ChartJS, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  Title, Tooltip, 
  PointElement 
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Ensure LineElement is registered
ChartJS.register(
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  PointElement,
  LineElement
);

const TeamSpecificLineChart = ({
  title,
  data,
  chartKey,
  xAxisTitle = "Match Number",
  yAxisTitle = "Score",
}) => {
  if (!data) {
    return null;
  }

  return (
    <Paper elevation={1} sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ height: "300px", position: "relative" }}>
        <Chart
          key={chartKey}
          type="line"
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: xAxisTitle,
                },
              },
              y: {
                title: {
                  display: true,
                  text: yAxisTitle,
                },
                beginAtZero: true,
              },
            },
          }}
        />
      </Box>
    </Paper>
  );
};

export default TeamSpecificLineChart;

