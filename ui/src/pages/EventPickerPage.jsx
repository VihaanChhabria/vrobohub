import React, { useEffect, useState } from "react";
import vrobohubLogo from "../assets/vrobohub_logo.png";
import { Box } from "@mui/material";
import SearchComponent from "../components/EventPickerComponents/SearchComponent";
import SearchResultComponent from "../components/EventPickerComponents/SearchResultComponent";

const EventPickerPage = () => {
  const [scoutedEvents, setScoutedEvents] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchScoutedEvents = async () => {
      const res = await fetch(
        `https://vrobohub-api.onrender.com/events`
      );

      const data = await res.json();
      console.log(data);

      setScoutedEvents(data);
    };
    fetchScoutedEvents();
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "25vh",
        }}
      >
        <img
          src={vrobohubLogo}
          alt="VRoboHub Logo"
          style={{ width: "auto", height: "75%" }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "75vh",
          flexDirection: "row",
          gap: 2,
          width: "95vw",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "50vw",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <SearchComponent searchValue={searchValue} setSearchValue={setSearchValue}/>
        </Box>
        <SearchResultComponent scoutedEvents={scoutedEvents} searchValue={searchValue}/>
      </Box>
    </Box>
  );
};

export default EventPickerPage;
