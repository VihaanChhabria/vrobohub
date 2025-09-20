import express from "express";
import { supabase } from "../services/supabaseClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { event_key } = req.query;

  if (!event_key) {
    return res
      .status(400)
      .json({ error: "Missing 'event_key' query parameter" });
  }

  // Fetch all rows with the specified event_key
  const { data: rows, error } = await supabase
    .from("match_data")
    .select("*")
    .eq("event_key", event_key);

  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to query data", details: error.message });
  }

  if (!rows || rows.length === 0) {
    return res
      .status(404)
      .json({ error: "No data found for the provided event_key" });
  }

  // Merge all rows together
  // Flatten all matches and add scouted_by to each match in data
  const allMatches = [];

  rows.forEach(row => {
    row.data.forEach(match => {
      allMatches.push({
        ...match,
        scouted_by: row.scouted_by || []
      });
    });
  });

  const combined = {
    event_key: event_key,
    created_at: rows[0].created_at,
    data: allMatches
  };

  return res.status(200).json(combined);
});

router.get("/last-updated", async (req, res) => {
  const { event_key } = req.query;

  const { data, error } = await supabase
    .from("match_data")
    .select("created_at")
    .eq("event_key", event_key)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to query data", details: error.message });
  }

  return res.status(200).json(data[0].created_at);
});

export default router;
