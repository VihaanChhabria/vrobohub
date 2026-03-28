import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import EventInfoComponent from "../components/EventComponents/EventInfoComponent";
import RebuiltTeamAnalytics from "../components/EventAnalysisComponents/TeamSpecific/RebuiltTeamAnalytics";
import fetchFromCache from "../utils/fetchFromCache";
import fetchTBA from "../utils/fetchTBA";
import { toast } from "react-toastify";
import { Box } from "@mui/material";

const EventAnalysisPage = () => {
  const { event_key: selectedEvent } = useParams();

  const [eventName, setEventName] = useState("");
  const [scoutingData, setScoutingData] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamInfo, setTeamInfo] = useState({});
  const [availableTeams, setAvailableTeams] = useState([]);
  const [teamRecord, setTeamRecord] = useState({ wins: 0, losses: 0, ties: 0 });
  const [tbaEventMatchesData, setTBAEventMatchesData] = useState([]);
  useEffect(() => {
    const fetchEventName = async () => {
      try {
        const data = await fetchFromCache(
          "https://vrobohub-api.onrender.com/events",
          "https://vrobohub-api.onrender.com/events/last-updated",
          false,
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
          },
        );

        console.log("Fetched scouting data:", data);
        setScoutingData(data.data);
      } catch (error) {
        console.error("Failed to fetch scouting data:", error);
        toast.error("Failed to fetch scouting data");
      }
    };

    const fetchTeamInfo = async () => {
      try {
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/event/${selectedEvent}/teams/simple`,
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

    const fetchEventMatches = async () => {
      try {
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/event/${selectedEvent}/matches/simple`,
        );

        const formatted = data.map((match) => ({
          key: match.key,
          match: match.key.replace(`${selectedEvent}_`, ""),
          red: match.alliances.red.team_keys.map((key) =>
            Number(key.replace("frc", "")),
          ),
          blue: match.alliances.blue.team_keys.map((key) =>
            Number(key.replace("frc", "")),
          ),
        }));

        setTBAEventMatchesData(formatted);
      } catch (error) {
        console.error("Failed to fetch match data from TBA:", error);
        toast.error("Failed to fetch match data from TBA");
      }
    };

    const fetchAllData = async () => {
      await fetchScoutingData();
      await fetchTeamInfo();
      await fetchEventMatches();
    };

    fetchEventName();
    fetchAllData();
  }, [selectedEvent]);

  // Update available teams when team info changes
  useEffect(() => {
    if (Object.keys(teamInfo).length > 0) {
      const teamOptions = Object.keys(teamInfo)
        .map((num) => Number(num))
        .filter((num) => !Number.isNaN(num))
        .sort((a, b) => a - b)
        .map((teamNum) => ({
          value: teamNum,
          label: `${teamNum} - ${teamInfo[teamNum] || ""}`,
        }));

      setAvailableTeams(teamOptions);
    }
  }, [teamInfo]);

  // Fetch team record from TBA API
  useEffect(() => {
    const fetchTeamRecord = async () => {
      if (!selectedTeam || !selectedEvent) {
        setTeamRecord({ wins: 0, losses: 0, ties: 0 });
        return;
      }

      try {
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/team/frc${selectedTeam}/event/${selectedEvent}/status`,
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
      <EventInfoComponent eventName={eventName + " - Rebuilt Analysis"} />
      <RebuiltTeamAnalytics
        selectedTeam={selectedTeam}
        availableTeams={availableTeams}
        onTeamChange={setSelectedTeam}
        scoutingData={scoutingData}
        teamRecord={teamRecord}
        teamInfo={teamInfo}
        tbaEventMatchesData={tbaEventMatchesData}
        eventKey={selectedEvent}
      />
    </Box>
  );
};

export default EventAnalysisPage;
