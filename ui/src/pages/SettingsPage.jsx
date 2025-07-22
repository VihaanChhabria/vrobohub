import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "Not Found",
    team_number: "Not Found",
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      } else {
        setUser({
          email: session.user.email,
          team_number: session.user.user_metadata.team_number,
        });
      }
    };
    checkSession();
  }, []);

  const handleChangePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password changed successfully");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        minWidth: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "5vh",
      }}
    >
      <Box
        width="70vw"
        mx="auto"
        p={4}
        border="1px solid #ccc"
        borderRadius={4}
      >
        <Typography variant="h5" gutterBottom>
          Account Settings
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Email: {user.email}
        </Typography>

        <Typography variant="subtitle1" gutterBottom>
          Team Number: {user.team_number}
        </Typography>

        <Box mt={4}>
          <Typography variant="subtitle2" gutterBottom>
            Change Password
          </Typography>
          <TextField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={!newPassword}
          >
            Update Password
          </Button>
        </Box>

        <Box mt={4}>
          <Button variant="outlined" color="error" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsPage;
