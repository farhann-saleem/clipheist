import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';

// Live early-access numbers from the database: { total: 100, taken, left }. Refreshes every 30 s.
export default function useSpots() {
  const [spots, setSpots] = useState(null);
  useEffect(() => {
    if (!supabase) return undefined;
    let alive = true;
    const load = () => supabase.rpc('early_access_spots').then(({ data }) => { if (alive && data) setSpots(data); });
    load();
    const t = setInterval(load, 30000);
    return () => { alive = false; clearInterval(t); };
  }, []);
  return spots;
}
