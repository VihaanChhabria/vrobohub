import express from "express";
import { supabase } from "../services/supabaseClient.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  // Fetch table data of all events in vrobohub
  const { data: rows, error } = await supabase.from("all_events").select("*");

  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to query data", details: error.message });
  }

  const finalData = await Promise.all(
    rows.map(async (row) => {
      var eventName = row.name;
      if (!eventName) {
        const tbaRes = await fetch(
          `https://www.thebluealliance.com/api/v3/event/${row.event_key}/simple`,
          {
            headers: {
              "X-TBA-Auth-Key": process.env.TBA_KEY,
            },
          }
        );

        if (!tbaRes.ok) {
          eventName = "Unknown Event";
          return res
            .status(404)
            .json({
              error: "Failed to fetch from TBA",
              details: tbaRes.statusText,
            });
        } else {
          const tbaData = await tbaRes.json();
          eventName = tbaData.name || "Unnamed Event";
        }

        const { error } = await supabase
          .from("all_events")
          .update({ name: eventName })
          .eq("event_key", row.event_key);

        if (error) {
          return res.status(500).json({
            error: "Database insert failed",
            details: error.message,
          });
        }
      }

      return {
        event_key: row.event_key,
        name: eventName || "Unknown Event",
        scouted_by: row.scouted_by,
      };
    })
  );

  return res.status(200).json(finalData);
});

router.get("/last-updated", async (req, res) => {
  const { data, error } = await supabase
    .from("all_events")
    .select("updated_at")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (error) {
    return res
      .status(500)
      .json({ error: "Failed to query data", details: error.message });
  }

  return res.status(200).json(data[0].updated_at);
});

export default router;
