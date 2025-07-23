import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabaseClient";
import { ContentCopy } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "Not Found",
    team_number: "Not Found",
    api_key: "Not Found",
  });

  const [newPassword, setNewPassword] = useState("");

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
          api_key: session.user.user_metadata.api_key,
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

  const handleNewAPIKey = async () => {
    const confirmGeneration = window.confirm(
      "Are you sure you want to generate a new API key? This will invalidate your current API key and you will have to update all of your robots and scripts to use the new one. "
    );

    if (!confirmGeneration) return;

    const newAPIKey = crypto.randomUUID();

    const { error } = await supabase.auth.updateUser({
      data: {
        api_key: newAPIKey,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      setUser({
        ...user,
        api_key: newAPIKey,
      });

      toast.success("API key updated successfully");
    }
  };

  const handleSignOut = async () => {
    const confirmSignOut = window.confirm(
      "Are you sure you want to sign out? This will log you out of your account and you will need to log back in to access your account settings."
    );

    if (!confirmSignOut) return;

    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Box
      sx={{
        minHeight: "75vh",
        minWidth: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "3vh ",
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

        <Typography variant="subtitle1" gutterBottom mt={4}>
          API Key:
          <Box display="flex" alignItems="center">
            <TextField
              contentEditable
              value={user.api_key}
              variant="outlined"
              sx={{ mr: 2, width: "40%" }}
            />
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(user.api_key);
                toast.success("API Key copied to clipboard");
              }}
            >
              <ContentCopy />
            </IconButton>
          </Box>
        </Typography>

        <Box mt={2}>
          <Button variant="contained" onClick={handleNewAPIKey}>
            Generate New API Key
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
