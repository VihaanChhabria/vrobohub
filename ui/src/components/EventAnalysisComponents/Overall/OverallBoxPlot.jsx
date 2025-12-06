import React, { useMemo } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Chart } from "react-chartjs-2";

const OverallBoxPlot = ({
  scoutingData,
  teamInfo,
  selectedPeriods,
  selectedCategory,
  sortBy = "average",
}) => {
  const boxPlotData = useMemo(() => {
    if (
      !scoutingData ||
      scoutingData.length === 0 ||
      !teamInfo ||
      !selectedPeriods ||
      selectedPeriods.length === 0 ||
      !selectedCategory
    ) {
      return null;
    }

    // Get all unique teams from scouting data
    const teams = Array.from(
      new Set(scoutingData.map((match) => match.team_number))
    ).filter((team) => team !== null && team !== undefined);

    if (teams.length === 0) {
      return null;
    }

    // Map category to data field names
    const getDataField = (category, period) => {
      if (category === "L1") {
        return period === "auto"
          ? "auto_coral_place_l1_count"
          : "teleop_coral_place_l1_count";
      } else if (category === "L2") {
        return period === "auto"
          ? "auto_coral_place_l2_count"
          : "teleop_coral_place_l2_count";
      } else if (category === "L3") {
        return period === "auto"
          ? "auto_coral_place_l3_count"
          : "teleop_coral_place_l3_count";
      } else if (category === "L4") {
        return period === "auto"
          ? "auto_coral_place_l4_count"
          : "teleop_coral_place_l4_count";
      } else if (category === "processor") {
        return period === "auto"
          ? "auto_algae_place_processor"
          : "teleop_algae_place_processor";
      } else if (category === "net_shot") {
        return period === "auto"
          ? "auto_algae_place_net_shot"
          : "teleop_algae_place_net_shot";
      }
      return null;
    };

    // Calculate data for each team
    const teamDataMap = teams.map((teamNum) => {
      const teamMatches = scoutingData.filter(
        (match) => match.team_number === teamNum
      );

      // Collect values from selected periods
      const allValues = [];
      selectedPeriods.forEach((period) => {
        const field = getDataField(selectedCategory, period);
        if (field) {
          const values = teamMatches
            .map((m) => m[field])
            .filter(
              (v) => v !== null && v !== undefined && typeof v === "number"
            );
          allValues.push(...values);
        }
      });

      // Calculate all statistics for sorting
      const sorted = [...allValues].sort((a, b) => a - b);
      const average =
        allValues.length > 0
          ? allValues.reduce((sum, val) => sum + val, 0) / allValues.length
          : 0;
      const min = sorted.length > 0 ? sorted[0] : 0;
      const max = sorted.length > 0 ? sorted[sorted.length - 1] : 0;
      const median =
        sorted.length > 0
          ? sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)]
          : 0;
      const q1 =
        sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.25)] : 0;
      const q3 =
        sorted.length > 0 ? sorted[Math.floor(sorted.length * 0.75)] : 0;

      return {
        teamNum,
        values: allValues,
        average,
        median,
        min,
        max,
        q1,
        q3,
        teamLabel: `${teamNum} - ${teamInfo[teamNum] || ""}`,
      };
    });

    // Filter out teams with no data and sort by selected statistic (greatest to lowest)
    const sortedTeamData = teamDataMap
      .filter((team) => team.values.length > 0)
      .sort((a, b) => {
        const aValue = a[sortBy] || 0;
        const bValue = b[sortBy] || 0;
        return bValue - aValue;
      });

    if (sortedTeamData.length === 0) {
      return null;
    }

    // Prepare chart data with team labels (using team numbers for x-axis)
    const labels = sortedTeamData.map((team) => team.teamNum.toString());
    const data = sortedTeamData.map((team) => team.values);

    return {
      labels,
      datasets: [
        {
          label: `${selectedCategory} Distribution`,
          data: data,
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [scoutingData, teamInfo, selectedPeriods, selectedCategory, sortBy]);

  if (!boxPlotData) {
    return null;
  }

  const periodLabel =
    selectedPeriods.length === 2
      ? "Teleop + Auto"
      : selectedPeriods[0] === "teleop"
      ? "Teleop"
      : "Auto";

  // Calculate max values for each team to position team number labels
  const maxValues = useMemo(() => {
    if (!boxPlotData) return {};
    const maxMap = {};
    boxPlotData.datasets[0].data.forEach((values, index) => {
      if (Array.isArray(values) && values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        maxMap[index] = sorted[sorted.length - 1];
      }
    });
    return maxMap;
  }, [boxPlotData]);

  // Calculate total width: 120px per team
  const boxPlotWidth = 100;
  const totalWidth = boxPlotData.labels.length * boxPlotWidth;

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        {selectedCategory} Distribution by Team ({periodLabel})
      </Typography>
      <Box
        sx={{
          height: "500px",
          position: "relative",
          overflowX: "auto",
          overflowY: "hidden",
        }}
      >
        <Box sx={{ width: `${totalWidth}px`, height: "100%" }}>
          <Chart
            key={`overall-boxplot-${selectedCategory}-${selectedPeriods.join(
              "-"
            )}-${sortBy}`}
            type="boxplot"
            data={boxPlotData}
            width={totalWidth}
            height={500}
            options={{
              responsive: false,
              maintainAspectRatio: false,
              layout: {
                padding: {
                  top: 30, // Space for team numbers
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    title: function (context) {
                      const teamNum = parseInt(context[0].label);
                      const nickname = teamInfo[teamNum];
                      return nickname
                        ? `Team ${teamNum} - ${nickname}`
                        : `Team ${teamNum}`;
                    },
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
                    text: "Team",
                  },
                  ticks: {
                    maxRotation: 0,
                    minRotation: 0,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: "Count",
                  },
                  beginAtZero: true,
                },
              },
            }}
            plugins={[
              {
                id: "teamNumberLabels",
                afterDraw: (chart) => {
                  const ctx = chart.ctx;
                  const meta = chart.getDatasetMeta(0);
                  const yScale = chart.scales.y;

                  boxPlotData.labels.forEach((label, index) => {
                    const maxValue = maxValues[index];
                    if (maxValue === undefined) return;

                    const point = meta.data[index];
                    if (!point) return;

                    const x = point.x;
                    const y = yScale.getPixelForValue(maxValue) - 15; // Position above max

                    ctx.save();
                    ctx.font = "bold 12px Arial";
                    ctx.fillStyle = "#000";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(label, x, y);
                    ctx.restore();
                  });
                },
              },
            ]}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default OverallBoxPlot;
