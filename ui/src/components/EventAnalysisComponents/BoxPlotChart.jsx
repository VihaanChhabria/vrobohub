import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Chart } from "react-chartjs-2";

const BoxPlotChart = ({
  title,
  data,
  chartKey,
  xAxisTitle = "Category",
  yAxisTitle = "Count",
}) => {
  if (!data || !data.datasets[0].data.some((arr) => arr.length > 0)) {
    return null;
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, flex: 1, minWidth: "400px" }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ height: "400px", position: "relative" }}>
        <Chart
          key={chartKey}
          type="boxplot"
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const values = context.raw;
                    if (Array.isArray(values) && values.length > 0) {
                      const sorted = [...values].sort((a, b) => a - b);
                      const min = sorted[0];
                      const q1 = sorted[Math.floor(sorted.length * 0.25)];
                      const median = sorted[Math.floor(sorted.length * 0.5)];
                      const q3 = sorted[Math.floor(sorted.length * 0.75)];
                      const max = sorted[sorted.length - 1];
                      return [
                        `Min: ${min}`,
                        `Q1: ${q1}`,
                        `Median: ${median}`,
                        `Q3: ${q3}`,
                        `Max: ${max}`,
                      ];
                    }
                    return "";
                  },
                },
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

export default BoxPlotChart;

