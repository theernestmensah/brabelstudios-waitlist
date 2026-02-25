// api/counter.js — Vercel Serverless Function
// Uses Upstash Redis REST API (env vars set in Vercel dashboard)

export default async function handler(req, res) {
    // Allow CORS from same origin
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env;

    if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) {
        return res.status(500).json({ error: 'Counter not configured' });
    }

    const headers = {
        Authorization: `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
    };

    try {
        if (req.method === 'GET') {
            // Read current count (no increment)
            const r = await fetch(`${UPSTASH_REDIS_REST_URL}/get/waitlist_count`, { headers });
            const data = await r.json();
            const count = parseInt(data.result ?? '0', 10) || 0;
            return res.status(200).json({ count });

        } else if (req.method === 'POST') {
            // Atomically increment by 1
            const r = await fetch(`${UPSTASH_REDIS_REST_URL}/incr/waitlist_count`, { headers });
            const data = await r.json();
            const count = parseInt(data.result ?? '1', 10) || 1;
            return res.status(200).json({ count });

        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (err) {
        return res.status(500).json({ error: 'Counter unavailable', count: 0 });
    }
}
