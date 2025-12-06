import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import EventInfoComponent from "../components/EventComponents/EventInfoComponent";
import ViewModeToggle from "../components/EventAnalysisComponents/ViewModeToggle";
import ToggleButtonGroup from "../components/EventAnalysisComponents/ToggleButtonGroup";
import TeamSpecificAnalysis from "../components/EventAnalysisComponents/TeamSpecific/TeamSpecificAnalysis";
import OverallBoxPlot from "../components/EventAnalysisComponents/Overall/OverallBoxPlot";
import fetchFromCache from "../utils/fetchFromCache";
import fetchTBA from "../utils/fetchTBA";
import { toast } from "react-toastify";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import {
  BoxPlotController,
  BoxAndWiskers,
} from "@sgratzl/chartjs-chart-boxplot";

// Register boxplot controller and required components
// This must happen before any Chart components are rendered
ChartJS.register(
  BoxPlotController,
  BoxAndWiskers,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const EventAnalysisPage = () => {
  const { event_key: selectedEvent } = useParams();

  const [eventName, setEventName] = useState("");
  const [viewMode, setViewMode] = useState("team-specific");
  const [scoutingData, setScoutingData] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamInfo, setTeamInfo] = useState({});
  const [availableTeams, setAvailableTeams] = useState([]);
  const [teamRecord, setTeamRecord] = useState({ wins: 0, losses: 0, ties: 0 });
  const [selectedPeriods, setSelectedPeriods] = useState(["teleop", "auto"]);
  const [selectedCategory, setSelectedCategory] = useState("L1");
  const [sortBy, setSortBy] = useState("average");
  useEffect(() => {
    const fetchEventName = async () => {
      try {
        const data = await fetchFromCache(
          "https://vrobohub-api.onrender.com/events",
          "https://vrobohub-api.onrender.com/events/last-updated",
          false
        );
        const event = data.find((event) => event.event_key === selectedEvent);

        // Convert the response to the desired format
        const formatted = `${event.event_key.slice(0, 4)} ${event.name}`;
        setEventName(formatted);
      } catch (error) {
        console.error("Failed to fetch team info from TBA:", error);
        toast.error("Failed to fetch team info from TBA");
      }
    };
    const fetchScoutingData = async () => {
      try {
        const data = await fetchFromCache(
          "https://vrobohub-api.onrender.com/matches",
          "https://vrobohub-api.onrender.com/matches/last-updated",
          false,
          {
            event_key: selectedEvent,
          }
        );

        console.log("Fetched scouting data:", data);

        await new Promise((resolve) => {
          setScoutingData(data.data);
          setTimeout(resolve, 0);
        });
      } catch (error) {
        console.error("Failed to fetch scouting data:", error);
        toast.error("Failed to fetch scouting data");
      }
    };

    const fetchTeamInfo = async () => {
      try {
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/event/${selectedEvent}/teams/simple`
        );

        // Convert the response to the desired format
        const formatted = {};
        data.forEach((team) => {
          formatted[team.team_number] = team.nickname;
        });
        setTeamInfo(formatted);
      } catch (error) {
        console.error("Failed to fetch team info from TBA:", error);
        toast.error("Failed to fetch team info from TBA");
      }
    };

    const fetchAllData = async () => {
      await fetchScoutingData();
      await fetchTeamInfo();
    };

    fetchEventName();
    fetchAllData();
  }, [selectedEvent]);

  // Update available teams when scouting data or team info changes
  useEffect(() => {
    if (
      scoutingData &&
      scoutingData.length > 0 &&
      Object.keys(teamInfo).length > 0
    ) {
      // Extract unique teams from scouting data
      const teams = new Set();
      scoutingData.forEach((match) => {
        if (match.team_number) {
          teams.add(match.team_number);
        }
      });

      // format to "Team Number - Nickname"
      const teamOptions = Array.from(teams)
        .sort((a, b) => a - b)
        .map((teamNum) => ({
          value: teamNum,
          label: `${teamNum} - ${teamInfo[teamNum] || ""}`,
        }));

      setAvailableTeams(teamOptions);
    }
  }, [scoutingData, teamInfo]);

  // Fetch team record from TBA API
  useEffect(() => {
    const fetchTeamRecord = async () => {
      if (!selectedTeam || !selectedEvent) {
        setTeamRecord({ wins: 0, losses: 0, ties: 0 });
        return;
      }

      try {
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/team/frc${selectedTeam}/event/${selectedEvent}/status`
        );

        if (data && data.qual && data.qual.ranking) {
          const ranking = data.qual.ranking;
          setTeamRecord({
            wins: ranking.record?.wins || 0,
            losses: ranking.record?.losses || 0,
            ties: ranking.record?.ties || 0,
          });
        } else {
          setTeamRecord({ wins: 0, losses: 0, ties: 0 });
        }
      } catch (error) {
        console.error("Failed to fetch team record from TBA:", error);
        setTeamRecord({ wins: 0, losses: 0, ties: 0 });
      }
    };

    fetchTeamRecord();
  }, [selectedTeam, selectedEvent]);

  return (
    <Box sx={{ p: 4 }}>
      <EventInfoComponent eventName={eventName + " - Analysis"} />
      <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      {viewMode === "team-specific" && (
        <TeamSpecificAnalysis
          selectedTeam={selectedTeam}
          availableTeams={availableTeams}
          onTeamChange={setSelectedTeam}
          scoutingData={scoutingData}
          teamRecord={teamRecord}
          selectedEvent={selectedEvent}
        />
      )}
      {viewMode === "overall" && (
        <Box>
          <ToggleButtonGroup
            value={selectedPeriods}
            onChange={setSelectedPeriods}
            options={[
              { value: "teleop", label: "Teleop", ariaLabel: "teleop" },
              { value: "auto", label: "Auto", ariaLabel: "auto" },
            ]}
            exclusive={false}
            ariaLabel="period selection"
          />
          <ToggleButtonGroup
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { value: "L1", label: "L1", ariaLabel: "L1" },
              { value: "L2", label: "L2", ariaLabel: "L2" },
              { value: "L3", label: "L3", ariaLabel: "L3" },
              { value: "L4", label: "L4", ariaLabel: "L4" },
              {
                value: "processor",
                label: "Processor",
                ariaLabel: "processor",
              },
              { value: "net_shot", label: "Net Shot", ariaLabel: "net shot" },
            ]}
            exclusive={true}
            ariaLabel="category selection"
          />
          <ToggleButtonGroup
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: "average", label: "Average", ariaLabel: "average" },
              { value: "median", label: "Median", ariaLabel: "median" },
              { value: "min", label: "Min", ariaLabel: "min" },
              { value: "max", label: "Max", ariaLabel: "max" },
              { value: "q1", label: "Q1", ariaLabel: "quartile 1" },
              { value: "q3", label: "Q3", ariaLabel: "quartile 3" },
            ]}
            exclusive={true}
            ariaLabel="sort by selection"
          />
          <OverallBoxPlot
            scoutingData={scoutingData}
            teamInfo={teamInfo}
            selectedPeriods={selectedPeriods}
            selectedCategory={selectedCategory}
            sortBy={sortBy}
          />
        </Box>
      )}
    </Box>
  );
};

export default EventAnalysisPage;
