import React, { useState } from "react";
import FilterBarComponent from "../components/FilterBarComponent";
import EventInfoComponent from "../components/EventInfoComponent";
import { Box } from "@mui/material";
import TableComponent from "../components/TableComponent";
import scoutingData from "../assets/scouting_data.json";
import { useEffect } from "react";
import { toast } from "react-toastify";

const EventPage = () => {
  const [selectedEvent, setSelectedEvent] = useState("2025mrcmp");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);

  const [tbaEventMatchesData, setTBAEventMatchesData] = useState([]);
  const [teamInfo, setTeamInfo] = useState({});
  const [eventName, setEventName] = useState("");

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
        const response = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${selectedEvent}/matches/simple`,
          {
            headers: {
              "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY,
            },
          }
        );

        // Convert the response to the desired format
        if (response.ok) {
          const data = await response.json();
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
            }))
            .sort((a, b) => {
              const ak = sortMatchKey(a.match);
              const bk = sortMatchKey(b.match);
              return ak.type - bk.type || ak.set - bk.set || ak.num - bk.num;
            });
          console.log(formatted);
          setTBAEventMatchesData(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch match data from TBA:", error);
        toast.error("Failed to fetch match data from TBA");
      }
    };

    const fetchTeamInfo = async () => {
      try {
        const response = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${selectedEvent}/teams/simple`,
          {
            headers: {
              "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY,
            },
          }
        );

        // Convert the response to the desired format
        if (response.ok) {
          const data = await response.json();
          const formatted = {};
          data.forEach((team) => {
            formatted[team.team_number] = team.nickname;
          });
          console.log(formatted);
          setTeamInfo(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch team info from TBA:", error);
        toast.error("Failed to fetch team info from TBA");
      }
    };

    const fetchEventName = async () => {
      try {
        const response = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${selectedEvent}`,
          {
            headers: {
              "X-TBA-Auth-Key": import.meta.env.VITE_TBA_AUTH_KEY,
            },
          }
        );

        // Convert the response to the desired format
        if (response.ok) {
          const data = await response.json();
          const formatted = `${data.year} ${data.name}`;
          console.log(formatted);
          setEventName(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch team info from TBA:", error);
        toast.error("Failed to fetch team info from TBA");
      }
    };

    fetchMatches();
    fetchTeamInfo();
    fetchEventName();
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
