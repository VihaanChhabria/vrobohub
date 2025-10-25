import React, { useState } from "react";
import FilterBarComponent from "../components/EventComponents/FilterBarComponent";
import EventInfoComponent from "../components/EventComponents/EventInfoComponent";
import TableComponent from "../components/EventComponents/TableComponent";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import fetchTBA from "../utils/fetchTBA";
import fetchFromCache from "../utils/fetchFromCache";

const EventPage = () => {
  const { event_key: selectedEvent } = useParams();

  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);

  const [tbaEventMatchesData, setTBAEventMatchesData] = useState([]);
  const [teamInfo, setTeamInfo] = useState({});
  const [eventName, setEventName] = useState("");

  const [scoutingData, setScoutedData] = useState([]);

  const sortMatchKey = (key) => {
    const match = key.replace(`${selectedEvent}_`, "");

    // Match types like qm123, sf2m3, f1m2
    const qm = match.match(/^qm(\d+)$/);
    if (qm) return { type: 1, set: 0, num: parseInt(qm[1]) };

    const sf = match.match(/^sf(\d+)m(\d+)$/);
    if (sf) return { type: 2, set: parseInt(sf[1]), num: parseInt(sf[2]) };

    const f = match.match(/^f(\d+)m(\d+)$/);
    if (f) return { type: 3, set: parseInt(f[1]), num: parseInt(f[2]) };

    return { type: 999, set: 0, num: 0 }; // unknown format fallback
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await fetchTBA(
          `https://www.thebluealliance.com/api/v3/event/${selectedEvent}/matches/simple`
        );

        console.log("selectedMatches:", selectedMatches);

        const formatted = data
          .map((match) => ({
            match: match.key.replace(`${selectedEvent}_`, ""),
            red: match.alliances.red.team_keys.map((key) =>
              key.replace("frc", "")
            ),
            blue: match.alliances.blue.team_keys.map((key) =>
              key.replace("frc", "")
            ),
            redScore: match.alliances.red.score,
            blueScore: match.alliances.blue.score,
            scouted_by: selectedMatches.filter((m) => m.match_key === match.key)
              .map((m) => m.scouted_by)
              .flat(),
          }))
          .sort((a, b) => {
            const ak = sortMatchKey(a.match);
            const bk = sortMatchKey(b.match);
            return ak.type - bk.type || ak.set - bk.set || ak.num - bk.num;
          });
        setTBAEventMatchesData(formatted);
      } catch (error) {
        console.error("Failed to fetch match data from TBA:", error);
        toast.error("Failed to fetch match data from TBA");
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
          setScoutedData(data.data);
          setTimeout(resolve, 0);
        });
      } catch (error) {
        console.error("Failed to fetch scouting data:", error);
        toast.error("Failed to fetch scouting data");
      }
    };

    fetchTeamInfo();
    fetchEventName();
    const fetchAllData = async () => {
      await fetchScoutingData();
      console.log("Scouting data after fetch:", scoutingData);
      await fetchMatches();
    };
    fetchAllData();
  }, []);
  return (
    <div>
      <Box sx={{ p: 4 }}>
        <EventInfoComponent matchData={scoutingData} eventName={eventName} />
        <FilterBarComponent
          tbaEventMatchesData={tbaEventMatchesData}
          teamInfo={teamInfo}
          selectedTeams={selectedTeams}
          setSelectedTeams={setSelectedTeams}
          selectedMatches={selectedMatches}
          setSelectedMatches={setSelectedMatches}
        />
        <TableComponent
          tbaEventMatchesData={tbaEventMatchesData}
          teamInfo={teamInfo}
          scoutingData={scoutingData}
          selectedTeams={selectedTeams}
          selectedMatches={selectedMatches}
        />
      </Box>
    </div>
  );
};

export default EventPage;
