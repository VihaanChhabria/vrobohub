import React, { useEffect, useState } from "react";
import vrobohubLogo from "../assets/vrobohub_logo.png";
import { Box } from "@mui/material";
import SearchComponent from "../components/EventPickerComponents/SearchComponent";
import SearchResultComponent from "../components/EventPickerComponents/SearchResultComponent";
import fetchFromCache from "../utils/fetchFromCache";

const EventPickerPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [scoutedEvents, setScoutedEvents] = useState([]);

  useEffect(() => {
    const fetchScoutedEvents = async () => {
      const data = await fetchFromCache(
        "https://vrobohub-api.onrender.com/events",
        "https://vrobohub-api.onrender.com/events/last-updated",
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
        height: "85vh",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 2,
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "45vw",
            height: "90vh",
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
