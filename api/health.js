// Vercel Serverless Function: Health check with CORS
export default async function handler(req, res) {
	// Basic CORS for cross-origin usage (customize as needed)
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	if (req.method !== 'GET') {
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}

	const deeplKeyConfigured = Boolean(process.env.DEEPL_API_KEY);
	res.status(200).json({
		ok: true,
		service: 'multi-translator-backend',
		deeplKeyConfigured
	});
}


