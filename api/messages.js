// Serverless endpoint to list contact messages from Supabase.
// Usage: send an `x-admin-key` header matching process.env.ADMIN_VIEW_KEY.
// Requires the Supabase service-role key in `process.env.SUPABASE_SERVICE_ROLE`.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;
const ADMIN_KEY = process.env.ADMIN_VIEW_KEY;

module.exports = async (req, res) => {
  try {
    const providedKey = (req.headers['x-admin-key'] || req.query.key || '').toString();
    if (!ADMIN_KEY || providedKey !== ADMIN_KEY) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return res.status(500).json({ error: 'Supabase configuration missing on server' });
    }

    const url = `${SUPABASE_URL.replace(/\/+$/, '')}/rest/v1/contact_messages?select=*&order=created_at.desc`;

    const r = await fetch(url, {
      headers: {
        apikey: SERVICE_ROLE,
        Authorization: `Bearer ${SERVICE_ROLE}`,
        Accept: 'application/json',
      },
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: 'Upstream error', details: txt });
    }

    const data = await r.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err && err.message ? err.message : String(err) });
  }
};
