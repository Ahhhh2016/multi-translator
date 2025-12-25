# MultiTranslator

<p align="center">
  <img width="580" height="300" alt="image" src="/example.jpg" />
</p>

MultiTranslator is a zero-dependency, single-file web translator that supports multilingual translation with DeepL and LibreTranslate, and built-in text-to-speech via the browser’s native Web Speech API.

👉 [Visit the website](https://mt-translator.vercel.app/)
🌐 [中文说明](README.zh-CN.md)

## Overview

The entire application runs in a single `index.html` file and can be opened directly in the browser or deployed to any static hosting service.  
An optional serverless backend is provided to proxy DeepL requests and keep API keys off the client.

## Features

- Translate between six languages using DeepL and LibreTranslate
- Optional backend to use DeepL without exposing API keys in the browser
- Native text-to-speech using the Web Speech API (no extra services required)
- Single-file, zero build step, easy to fork and customize

Supported languages: Chinese, English, Japanese, Korean, French, German

## Quick Start

1. Clone or download this repository.
2. Open `index.html` directly in your browser, or deploy it to a static host such as GitHub Pages or Vercel.
3. Enter text, select source and target languages, and translate.

If public LibreTranslate instances are slow or rate-limited, you can edit `index.html` and replace the built-in fallback endpoints with your own LibreTranslate instance.

## Optional Backend (DeepL Proxy)

To use DeepL without exposing your API key, this repository includes Vercel Serverless Functions.

### Deploy

1. Import the repository into Vercel (or use the Vercel CLI).
2. Set the environment variable `DEEPL_API_KEY`.
3. Deploy and obtain a URL such as `https://your-app.vercel.app`.

### Connect the Frontend

- If the frontend and backend share the same origin, no configuration is required.
- If they are hosted separately, run the following in the browser console:

```js
localStorage.setItem('backend_url', 'https://your-app.vercel.app');
```

### API

Health check:
```
GET /api/health
```

Translate:
```
POST /api/translate
```

Request body:
```
{
  "text": "Hello world",
  "sourceLang": "en",
  "targetLang": "de"
}
```

You may also pass a DeepL API key per request using the apiKey field. This is intended only for cases where each user provides their own key.

## Text-to-Speech

Text-to-speech is implemented using the browser’s native Web Speech API.

No backend or cloud service is required.

Speech runs entirely in the browser.

Voice selection is automatically matched to the target language when available.

Support depends on the browser and operating system. Modern Chrome, Edge, and Safari are recommended.

## Credits
- [LibreTranslate](https://libretranslate.com/) – Translation API
- [Busuanzi](https://busuanzi.ibruce.info/) – Page-view counter

## License

MIT