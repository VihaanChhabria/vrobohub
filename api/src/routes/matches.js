import express from 'express';
import { supabase } from '../services/supabaseClient.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { event_key } = req.query;

  if (!event_key) {
    return res.status(400).json({ error: "Missing 'event_key' query parameter" });
  }

  const { data, error } = await supabase
    .from('match_data')
    .select('data')
    .filter('data->>event_key', 'eq', event_key);

  if (error) {
    return res.status(500).json({ error: 'Failed to query data', details: error.message });
  }

  const matches = data.map(row => row.data);
  res.status(200).json(matches);
});

export default router;
