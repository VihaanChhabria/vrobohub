import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";
import { toast } from "react-toastify";

const LogInPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async () => {
    if (password === "" || email === "") {
      toast.error("Please fill in all the fields");
      return;
    }

    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success("Logged In Successfully");
      navigate("/");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "85vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          width: "50vw",
        }}
      >
        <Typography variant="h2" gutterBottom textAlign={"center"}>
          Welcome to VRoboHub
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Please Log In to continue
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => handleLogIn()}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );
};

export default LogInPage;
