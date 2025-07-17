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
  const combined = rows.reduce(
    (acc, row) => {
      acc.scouted_by = [...new Set([...acc.scouted_by, ...row.scouted_by])];
      acc.data = [...acc.data, ...row.data];
      if (new Date(row.created_at) < new Date(acc.created_at)) {
        acc.created_at = row.created_at;
      }
      return acc;
    },
    {
      event_key: event_key,
      scouted_by: [],
      data: [],
      created_at: rows[0].created_at,
    }
  );

  return res.status(200).json(combined);
});

router.get("/last_updated", async (req, res) => {
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
