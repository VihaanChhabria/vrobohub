import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import TeamSpecificSelector from "./TeamSpecificSelector";
import TeamSpecificStatsCards from "./TeamSpecificStatsCards";
import TeamSpecificBoxPlotChart from "./TeamSpecificBoxPlotChart";
import TeamSpecificOverTimeMetrics from "./TeamSpecificOverTimeMetrics";

const TeamSpecificAnalysis = ({
  selectedTeam,
  availableTeams,
  onTeamChange,
  scoutingData,
  teamRecord,
  selectedEvent,
}) => {
  // Calculate team statistics from scouting data
  const teamStats = useMemo(() => {
    if (!selectedTeam || !scoutingData || scoutingData.length === 0) {
      return [
        { title: "Climb Success Rate %", value: "N/A" },
        { title: "# of Climb Attempts", value: "0" },
        { title: "Brake Down Rate %", value: "N/A" },
        { title: "Wins/Losses/Ties", value: "0/0/0" },
      ];
    }

    // Filter scouting data for selected team
    const teamData = scoutingData.filter(
      (match) => match.team_number === selectedTeam
    );

    if (teamData.length === 0) {
      return [
        { title: "Climb Success Rate %", value: "N/A" },
        { title: "# of Climb Attempts", value: "0" },
        { title: "Brake Down Rate %", value: "N/A" },
        { title: "Wins/Losses/Ties", value: "0/0/0" },
      ];
    }

    // Calculate climb statistics
    const climbAttempts = teamData.filter(
      (m) => m.deep_climb_attempted || m.shallow_climb_attempted
    ).length;
    const successfulClimbs = teamData.filter(
      (m) =>
        (m.deep_climb_attempted || m.shallow_climb_attempted) && !m.climb_failed
    ).length;
    const climbSuccessRate =
      climbAttempts > 0
        ? Math.round((successfulClimbs / climbAttempts) * 100)
        : 0;

    // Calculate brake down rate
    const breakdowns = teamData.filter((m) => m.broke_down).length;
    const breakdownRate =
      teamData.length > 0
        ? Math.round((breakdowns / teamData.length) * 100)
        : 0;

    return [
      {
        title: "Climb Success Rate %",
        value: `${climbSuccessRate}%`,
      },
      {
        title: "# of Climb Attempts",
        value: climbAttempts.toString(),
      },
      {
        title: "Brake Down Rate %",
        value: `${breakdownRate}%`,
      },
      {
        title: "Wins/Losses/Ties",
        value: `${teamRecord.wins}/${teamRecord.losses}/${teamRecord.ties}`,
      },
    ];
  }, [selectedTeam, scoutingData, teamRecord]);

  // Prepare box plot data for the selected team
  const boxPlotData = useMemo(() => {
    if (!selectedTeam || !scoutingData || scoutingData.length === 0) {
      return null;
    }

    // Filter scouting data for selected team
    const teamData = scoutingData.filter(
      (match) => match.team_number === selectedTeam
    );

    if (teamData.length === 0) {
      return null;
    }

    // Extract values for each level - only include actual values (not zeros unless they're meaningful)
    const l1Values = teamData
      .map((m) => m.teleop_coral_place_l1_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const l2Values = teamData
      .map((m) => m.teleop_coral_place_l2_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const l3Values = teamData
      .map((m) => m.teleop_coral_place_l3_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const l4Values = teamData
      .map((m) => m.teleop_coral_place_l4_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");

    // Ensure we have at least some data
    if (
      l1Values.length === 0 &&
      l2Values.length === 0 &&
      l3Values.length === 0 &&
      l4Values.length === 0
    ) {
      return null;
    }

    return {
      labels: ["L1", "L2", "L3", "L4"],
      datasets: [
        {
          label: "Teleop Coral Placement",
          data: [l1Values, l2Values, l3Values, l4Values],
          backgroundColor: "rgba(54, 162, 235, 0.5)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [selectedTeam, scoutingData]);

  // Prepare box plot data for net shots and processor
  const algaeBoxPlotData = useMemo(() => {
    if (!selectedTeam || !scoutingData || scoutingData.length === 0) {
      return null;
    }

    // Filter scouting data for selected team
    const teamData = scoutingData.filter(
      (match) => match.team_number === selectedTeam
    );

    if (teamData.length === 0) {
      return null;
    }

    // Extract values for net shots and processor
    const netShotValues = teamData
      .map((m) => m.teleop_algae_place_net_shot)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const processorValues = teamData
      .map((m) => m.teleop_algae_place_processor)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");

    // Ensure we have at least some data
    if (netShotValues.length === 0 && processorValues.length === 0) {
      return null;
    }

    return {
      labels: ["Net Shot", "Processor"],
      datasets: [
        {
          label: "Teleop Algae Placement",
          data: [netShotValues, processorValues],
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [selectedTeam, scoutingData]);

  // Prepare box plot data for auto coral placement
  const autoCoralBoxPlotData = useMemo(() => {
    if (!selectedTeam || !scoutingData || scoutingData.length === 0) {
      return null;
    }

    // Filter scouting data for selected team
    const teamData = scoutingData.filter(
      (match) => match.team_number === selectedTeam
    );

    if (teamData.length === 0) {
      return null;
    }

    // Extract values for each level - auto coral
    const l1Values = teamData
      .map((m) => m.auto_coral_place_l1_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const l2Values = teamData
      .map((m) => m.auto_coral_place_l2_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const l3Values = teamData
      .map((m) => m.auto_coral_place_l3_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const l4Values = teamData
      .map((m) => m.auto_coral_place_l4_count)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");

    // Ensure we have at least some data
    if (
      l1Values.length === 0 &&
      l2Values.length === 0 &&
      l3Values.length === 0 &&
      l4Values.length === 0
    ) {
      return null;
    }

    return {
      labels: ["L1", "L2", "L3", "L4"],
      datasets: [
        {
          label: "Auto Coral Placement",
          data: [l1Values, l2Values, l3Values, l4Values],
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [selectedTeam, scoutingData]);

  // Prepare box plot data for auto algae placement
  const autoAlgaeBoxPlotData = useMemo(() => {
    if (!selectedTeam || !scoutingData || scoutingData.length === 0) {
      return null;
    }

    // Filter scouting data for selected team
    const teamData = scoutingData.filter(
      (match) => match.team_number === selectedTeam
    );

    if (teamData.length === 0) {
      return null;
    }

    // Extract values for auto algae
    const netShotValues = teamData
      .map((m) => m.auto_algae_place_net_shot)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");
    const processorValues = teamData
      .map((m) => m.auto_algae_place_processor)
      .filter((v) => v !== null && v !== undefined && typeof v === "number");

    // Ensure we have at least some data
    if (netShotValues.length === 0 && processorValues.length === 0) {
      return null;
    }

    return {
      labels: ["Net Shot", "Processor"],
      datasets: [
        {
          label: "Auto Algae Placement",
          data: [netShotValues, processorValues],
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 2,
        },
      ],
    };
  }, [selectedTeam, scoutingData]);

  // Calculate score for a single match
  const calculateMatchScore = (match, period = "total") => {
    let score = 0;

    if (period === "auto" || period === "total") {
      // Auto Coral scoring: L1=3, L2=4, L3=6, L4=7
      score +=
        (match.auto_coral_place_l1_count || 0) * 3 +
        (match.auto_coral_place_l2_count || 0) * 4 +
        (match.auto_coral_place_l3_count || 0) * 6 +
        (match.auto_coral_place_l4_count || 0) * 7;

      // Auto Algae scoring: Processor=6, Net=4
      score +=
        (match.auto_algae_place_processor || 0) * 6 +
        (match.auto_algae_place_net_shot || 0) * 4;
    }

    if (period === "teleop" || period === "total") {
      // Teleop Coral scoring: L1=2, L2=3, L3=4, L4=5
      score +=
        (match.teleop_coral_place_l1_count || 0) * 2 +
        (match.teleop_coral_place_l2_count || 0) * 3 +
        (match.teleop_coral_place_l3_count || 0) * 4 +
        (match.teleop_coral_place_l4_count || 0) * 5;

      // Teleop Algae scoring: Processor=6, Net=4
      score +=
        (match.teleop_algae_place_processor || 0) * 6 +
        (match.teleop_algae_place_net_shot || 0) * 4;
    }

    return score;
  };

  // Calculate coral score for a match
  const calculateCoralScore = (match) => {
    let score = 0;
    // Auto Coral
    score +=
      (match.auto_coral_place_l1_count || 0) * 3 +
      (match.auto_coral_place_l2_count || 0) * 4 +
      (match.auto_coral_place_l3_count || 0) * 6 +
      (match.auto_coral_place_l4_count || 0) * 7;
    // Teleop Coral
    score +=
      (match.teleop_coral_place_l1_count || 0) * 2 +
      (match.teleop_coral_place_l2_count || 0) * 3 +
      (match.teleop_coral_place_l3_count || 0) * 4 +
      (match.teleop_coral_place_l4_count || 0) * 5;
    return score;
  };

  // Calculate algae score for a match
  const calculateAlgaeScore = (match) => {
    let score = 0;
    // Auto Algae
    score +=
      (match.auto_algae_place_processor || 0) * 6 +
      (match.auto_algae_place_net_shot || 0) * 4;
    // Teleop Algae
    score +=
      (match.teleop_algae_place_processor || 0) * 6 +
      (match.teleop_algae_place_net_shot || 0) * 4;
    return score;
  };

  // Prepare over-time metrics data
  const overTimeMetricsData = useMemo(() => {
    if (!selectedTeam || !scoutingData || scoutingData.length === 0) {
      return null;
    }

    // Filter and sort scouting data for selected team by match number
    const teamData = scoutingData
      .filter((match) => match.team_number === selectedTeam)
      .sort((a, b) => {
        // Extract match number for sorting (e.g., "qm35" -> 35)
        const getMatchNum = (matchStr) => {
          const match = matchStr.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        return getMatchNum(a.match_number) - getMatchNum(b.match_number);
      });

    if (teamData.length === 0) {
      return null;
    }

    const matchNumbers = teamData.map((m) => m.match_number);
    const totalScores = teamData.map((m) => calculateMatchScore(m, "total"));
    const teleopScores = teamData.map((m) => calculateMatchScore(m, "teleop"));
    const autoScores = teamData.map((m) => calculateMatchScore(m, "auto"));
    const algaeScores = teamData.map((m) => calculateAlgaeScore(m));
    const coralScores = teamData.map((m) => calculateCoralScore(m));

    return {
      total: {
        labels: matchNumbers,
        datasets: [
          {
            label: "Total Score",
            data: totalScores,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.4,
          },
        ],
      },
      teleop: {
        labels: matchNumbers,
        datasets: [
          {
            label: "Teleop Score",
            data: teleopScores,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            tension: 0.4,
          },
        ],
      },
      auto: {
        labels: matchNumbers,
        datasets: [
          {
            label: "Auto Score",
            data: autoScores,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            tension: 0.4,
          },
        ],
      },
      algae: {
        labels: matchNumbers,
        datasets: [
          {
            label: "Algae Score",
            data: algaeScores,
            borderColor: "rgba(153, 102, 255, 1)",
            backgroundColor: "rgba(153, 102, 255, 0.2)",
            tension: 0.4,
          },
        ],
      },
      coral: {
        labels: matchNumbers,
        datasets: [
          {
            label: "Coral Score",
            data: coralScores,
            borderColor: "rgba(255, 159, 64, 1)",
            backgroundColor: "rgba(255, 159, 64, 0.2)",
            tension: 0.4,
          },
        ],
      },
    };
  }, [selectedTeam, scoutingData]);

  return (
    <Box>
      <TeamSpecificSelector
        availableTeams={availableTeams}
        selectedTeam={selectedTeam}
        onTeamChange={onTeamChange}
      />
      {selectedTeam && <TeamSpecificStatsCards stats={teamStats} />}

      {!selectedTeam && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "200px",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Please select a team to view analysis
          </Typography>
        </Box>
      )}

      {selectedTeam && (
        <>
          <Typography variant="h4" sx={{ mt: 4, mb: 3 }}>
            Performance
          </Typography>
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
            <TeamSpecificBoxPlotChart
              title="Teleop Coral Placement Distribution"
              data={boxPlotData}
              chartKey={`boxplot-teleop-coral-${selectedTeam}`}
              xAxisTitle="Level"
              yAxisTitle="Count"
            />
            <TeamSpecificBoxPlotChart
              title="Teleop Algae Placement Distribution"
              data={algaeBoxPlotData}
              chartKey={`boxplot-teleop-algae-${selectedTeam}`}
              xAxisTitle="Type"
              yAxisTitle="Count"
            />
            <TeamSpecificBoxPlotChart
              title="Auto Coral Placement Distribution"
              data={autoCoralBoxPlotData}
              chartKey={`boxplot-auto-coral-${selectedTeam}`}
              xAxisTitle="Level"
              yAxisTitle="Count"
            />
            <TeamSpecificBoxPlotChart
              title="Auto Algae Placement Distribution"
              data={autoAlgaeBoxPlotData}
              chartKey={`boxplot-auto-algae-${selectedTeam}`}
              xAxisTitle="Type"
              yAxisTitle="Count"
            />
          </Box>

          <Typography variant="h4" sx={{ mt: 4, mb: 3 }}>
            Over Time Metrics
          </Typography>
          <TeamSpecificOverTimeMetrics
            data={overTimeMetricsData}
            selectedTeam={selectedTeam}
          />
        </>
      )}
    </Box>
  );
};

export default TeamSpecificAnalysis;

