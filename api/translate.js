// Vercel Serverless Function: DeepL translate proxy with CORS
function mapAppLangToDeepL(appLang) {
	const map = { zh: 'ZH', en: 'EN', ja: 'JA', ko: 'KO', fr: 'FR', de: 'DE' };
	if (!appLang) return '';
	return map[appLang] || String(appLang).toUpperCase();
}

function chooseDeepLEndpointsByKey(apiKey) {
	const looksFree = typeof apiKey === 'string' && apiKey.includes(':fx');
	if (looksFree) {
		return ['https://api-free.deepl.com/v2/translate', 'https://api.deepl.com/v2/translate'];
	}
	return ['https://api.deepl.com/v2/translate', 'https://api-free.deepl.com/v2/translate'];
}

async function readRequestBody(req) {
	if (req.body && typeof req.body === 'object') return req.body;
	const raw = await new Promise(resolve => {
		let data = '';
		req.on('data', chunk => { data += chunk; });
		req.on('end', () => resolve(data));
	});
	try { return JSON.parse(raw || '{}'); } catch (_) { return {}; }
}

export default async function handler(req, res) {
	// Basic CORS for cross-origin usage (customize as needed)
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method Not Allowed' });
		return;
	}

	try {
		const { text, targetLang, sourceLang, apiKey } = await readRequestBody(req);
		const providedKey = typeof apiKey === 'string' ? apiKey.trim() : '';
		const keyToUse = providedKey || (process.env.DEEPL_API_KEY || '');
		if (!keyToUse) {
			res.status(400).json({ error: 'Missing DeepL apiKey (provide in body or set DEEPL_API_KEY)' });
			return;
		}

		if (
			(typeof text !== 'string' && !Array.isArray(text)) ||
			(typeof targetLang !== 'string' || !targetLang.trim())
		) {
			res.status(400).json({ error: 'Invalid body. Expect { text: string|string[], targetLang: string, sourceLang?: string }' });
			return;
		}

		const textList = Array.isArray(text) ? text : [text];
		if (textList.length === 0 || textList.some(t => typeof t !== 'string')) {
			res.status(400).json({ error: 'text must be a non-empty string or array of strings' });
			return;
		}
		const totalChars = textList.reduce((acc, t) => acc + t.length, 0);
		if (totalChars > 100000) {
			res.status(413).json({ error: 'Text too large (limit ~100k characters per request)' });
			return;
		}

		const target = mapAppLangToDeepL(targetLang);
		if (!target) {
			res.status(400).json({ error: 'Invalid targetLang' });
			return;
		}
		const source = sourceLang ? mapAppLangToDeepL(sourceLang) : '';

		const params = new URLSearchParams();
		for (const t of textList) params.append('text', t);
		params.set('target_lang', target);
		if (source) params.set('source_lang', source);

		const endpoints = chooseDeepLEndpointsByKey(keyToUse);
		let lastError = null;
		let result = null;

		for (const endpoint of endpoints) {
			try {
				const resp = await fetch(endpoint, {
					method: 'POST',
					headers: {
						'Authorization': `DeepL-Auth-Key ${keyToUse}`,
						'Content-Type': 'application/x-www-form-urlencoded',
						'Accept': 'application/json'
					},
					body: params.toString()
				});
				if (!resp.ok) {
					let errBody = '';
					try { errBody = await resp.text(); } catch (_) {}
					lastError = new Error(`DeepL error ${resp.status}: ${errBody}`);
					continue;
				}
				result = await resp.json();
				break;
			} catch (e) {
				lastError = e;
				continue;
			}
		}

		if (!result) {
			const message = lastError ? String(lastError.message || lastError) : 'Unknown error contacting DeepL';
			res.status(502).json({ error: message });
			return;
		}

		const translations = Array.isArray(result?.translations) ? result.translations : [];
		const combined = translations.map(t => t?.text || '').join('\n');

		res.status(200).json({
			ok: true,
			resultText: combined,
			translations
		});
	} catch (err) {
		res.status(500).json({ error: 'Internal server error' });
	}
}


