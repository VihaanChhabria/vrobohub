import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";

const SignUpPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [teamNumber, setTeamNumber] = useState("");

  const handleSignUp = async () => {
    if (
      password === "" ||
      confirmPassword === "" ||
      teamNumber === "" ||
      email === ""
    ) {
      toast.error("Please fill in all the fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          team_number: teamNumber,
          api_key: crypto.randomUUID(),
        },
        emailRedirectTo: window.location.origin + "/login",
      },
    });

    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.info("Check your email for verification");
      navigate("/login");
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
          Please Sign Up to continue
        </Typography>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          required
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <TextField
          label="Team Number"
          variant="outlined"
          fullWidth
          required
          type="number"
          value={teamNumber}
          onChange={(e) => setTeamNumber(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => handleSignUp()}
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  );
};

export default SignUpPage;

