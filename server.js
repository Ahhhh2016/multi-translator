/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const DEEPL_API_KEY = process.env.DEEPL_API_KEY || '';

if (!DEEPL_API_KEY) {
	console.warn('[WARN] DEEPL_API_KEY is not set. Server will expect apiKey in request body.');
}

app.use(cors());
app.use(express.json({ limit: '1mb' }));

function mapAppLangToDeepL(appLang) {
	const map = {
		zh: 'ZH',
		en: 'EN',
		ja: 'JA',
		ko: 'KO',
		fr: 'FR',
		de: 'DE'
	};
	if (!appLang) return '';
	return map[appLang] || String(appLang).toUpperCase();
}

function chooseDeepLEndpointsByKey(apiKey) {
	// Heuristic: free keys often contain ":fx"
	const looksFree = typeof apiKey === 'string' && apiKey.includes(':fx');
	if (looksFree) {
		return ['https://api-free.deepl.com/v2/translate', 'https://api.deepl.com/v2/translate'];
	}
	return ['https://api.deepl.com/v2/translate', 'https://api-free.deepl.com/v2/translate'];
}

app.get('/health', (req, res) => {
	res.json({ ok: true, service: 'multi-translator-backend', deeplKeyConfigured: Boolean(DEEPL_API_KEY) });
});

app.post('/api/translate', async (req, res) => {
	try {
		const { text, targetLang, sourceLang, apiKey } = req.body || {};
		const providedKey = typeof apiKey === 'string' ? apiKey.trim() : '';
		const keyToUse = providedKey || DEEPL_API_KEY;
		if (!keyToUse) {
			return res.status(400).json({ error: 'Missing DeepL apiKey (provide in body or set DEEPL_API_KEY)' });
		}

		if (
			(typeof text !== 'string' && !Array.isArray(text)) ||
			(typeof targetLang !== 'string' || !targetLang.trim())
		) {
			return res.status(400).json({ error: 'Invalid body. Expect { text: string|string[], targetLang: string, sourceLang?: string }' });
		}

		// Normalize input
		const textList = Array.isArray(text) ? text : [text];
		if (textList.length === 0 || textList.some(t => typeof t !== 'string')) {
			return res.status(400).json({ error: 'text must be a non-empty string or array of strings' });
		}
		// Optional simple size guard
		const totalChars = textList.reduce((acc, t) => acc + t.length, 0);
		if (totalChars > 100000) {
			return res.status(413).json({ error: 'Text too large (limit ~100k characters per request)' });
		}

		const target = mapAppLangToDeepL(targetLang);
		if (!target) {
			return res.status(400).json({ error: 'Invalid targetLang' });
		}
		const source = sourceLang ? mapAppLangToDeepL(sourceLang) : '';

		const params = new URLSearchParams();
		for (const t of textList) {
			params.append('text', t);
		}
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
					try {
						errBody = await resp.text();
					} catch (_) {
						// ignore
					}
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
			return res.status(502).json({ error: message });
		}

		const translations = Array.isArray(result?.translations) ? result.translations : [];
		const combined = translations.map(t => t?.text || '').join('\n');

		return res.json({
			ok: true,
			resultText: combined,
			translations
		});
	} catch (err) {
		console.error('Unexpected error in /api/translate:', err);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

app.listen(PORT, () => {
	console.log(`[server] listening on http://localhost:${PORT}`);
});


