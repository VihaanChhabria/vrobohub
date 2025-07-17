import React, { useEffect, useState } from "react";
import vrobohubLogo from "../assets/vrobohub_logo.png";
import { Box } from "@mui/material";
import SearchComponent from "../components/EventPickerComponents/SearchComponent";
import SearchResultComponent from "../components/EventPickerComponents/SearchResultComponent";
import fetchFromCache from "../utils/fetchFromCache";

const EventPickerPage = () => {
  const [scoutedEvents, setScoutedEvents] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const fetchScoutedEvents = async () => {
      const data = await fetchFromCache(
        "https://vrobohub-api.onrender.com/events",
        "https://vrobohub-api.onrender.com/events/last_updated",
        false
      );

      setScoutedEvents(data);
    };
    fetchScoutedEvents();
  }, []);

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
          <SearchComponent
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </Box>
        <SearchResultComponent
          scoutedEvents={scoutedEvents}
          searchValue={searchValue}
        />
      </Box>
    </Box>
  );
};

export default EventPickerPage;
