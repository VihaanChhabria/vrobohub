import React, { useState } from "react";
import Button from "@mui/material/Button";
import FilterBarComponent from "../components/FilterBarComponent";

/**
 * @typedef {Object} MatchData
 * @property {string} event_key
 * @property {number} match_number
 * @property {number} team_number
 * @property {string} timestamp
 * @property {number} [coral_pieces]
 * @property {string} [climb_level]
 */

/** @type {MatchData[]} */
const sampleData = [
  {
    event_key: "2025txhou",
    match_number: 1,
    team_number: 7414,
    timestamp: "2025-07-01T12:00:00Z",
    coral_pieces: 5,
    climb_level: "High",
  },
  {
    event_key: "2025txhou",
    match_number: 2,
    team_number: 118,
    timestamp: "2025-07-01T12:10:00Z",
    coral_pieces: 3,
    climb_level: "Mid",
  },
  {
    event_key: "2025newton",
    match_number: 3,
    team_number: 254,
    timestamp: "2025-07-02T09:30:00Z",
    coral_pieces: 6,
  },
  {
    event_key: "2025newton",
    match_number: 3,
    team_number: 254,
    timestamp: "2025-07-02T09:31:00Z",
    coral_pieces: 4,
  },
  {
    event_key: "2025cala",
    match_number: 5,
    team_number: 1678,
    timestamp: "2025-07-03T15:00:00Z",
  },
];

const HomePage = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedMatches, setSelectedMatches] = useState([]);
  return (
    <div>
      {/* <Button variant="contained" color="primary">
        {" "}
        Click Me
      </Button> */}
      <FilterBarComponent
        matchData={sampleData}
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        selectedTeams={selectedTeams}
        setSelectedTeams={setSelectedTeams}
        selectedMatches={selectedMatches}
        setSelectedMatches={setSelectedMatches}
      />
    </div>
  );
};

export default HomePage;
