import { Box, Button, Typography } from "@mui/material";
import vrobohubLogo from "../assets/vrobohub_logo.png";
import React, { useEffect, useState } from "react";
import { ArrowBack, Settings } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";

const HeaderComponent = () => {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log("!!", event, session);
      if (session) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, []);
  return (
    <Box
      sx={{
        padding: 2,
        paddingLeft: 4,
        paddingRight: 4,
        backgroundColor: "#f5f5f5",
        display: "flex",
        gap: 2,
        alignItems: "center",
        height: "10vh",
      }}
    >
      <img
        src={vrobohubLogo}
        alt="VRoboHub Logo"
        style={{ width: "auto", height: "100%", cursor: "pointer" }}
        onClick={() => navigate("/")}
      />
      {loggedIn ? (
        window.location.pathname === "/settings" ? (
          <Button
            variant="outlined"
            color="error"
            startIcon={<ArrowBack />}
            sx={{ ml: "auto" }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<Settings />}
            sx={{ ml: "auto" }}
            onClick={() => navigate("/settings")}
          >
            Account Settings
          </Button>
        )
      ) : (
        <Box sx={{ marginLeft: "auto", display: "flex", gap: 3 }}>
          <Button
            variant="outlined"
            sx={{ ml: "auto" }}
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: "auto" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HeaderComponent;
