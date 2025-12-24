# MultiTranslator / 多语言网页翻译工具

<p align="center">
  <img width="580" height="300" alt="image" src="https://github.com/user-attachments/assets/67aa863c-1236-4c9f-ba58-1285e9fb6c5b" />
</p>


👉 [点击访问 MultiTranslator 网页应用](https://ahhhh2016.github.io/multi-translator/)

## 简介
MultiTranslator 是一个开源、零依赖的极简网页翻译工具，基于 LibreTranslate API 实现多语言互译。整个页面由单个 `index.html` 组成，无需后端部署；将文件放到任意静态服务器或直接双击即可使用。页面内置 Busuanzi 访问量统计。

### 功能
- 支持中英日韩法德语的相互翻译（LibreTranslate 提供）
- 访问量统计（Busuanzi）
- 单文件、零依赖，易于二次开发

### 使用方法
1. 克隆或下载本仓库。
2. 直接打开 `index.html`，或部署到任意静态主机（GitHub Pages、Vercel 等）。
3. 输入文本，选择语言，点击 **翻译**。

> 如遇 LibreTranslate 默认实例限制或速度问题，可在 `index.html` 中修改 `LIBRE_URL` 常量为你自己的 LibreTranslate 部署地址。

### 可选：后端（DeepL 代理）
如果你希望使用 DeepL 且不想在浏览器里暴露 API Key，可以在本仓库根目录启动一个非常简单的 Node.js 后端代理：

1) 安装依赖
```
npm install
```

2) 配置环境变量  
复制 `env.example` 为 `.env`，并填入你的 DeepL API Key：
```
DEEPL_API_KEY=你的key
```

3) 启动服务（默认端口 3001）
```
npm start
```

4) 调用接口  
`POST http://localhost:3001/api/translate`
```json
{ "text": "你好，世界", "targetLang": "en", "sourceLang": "zh" }
```
返回示例：
```json
{ "ok": true, "resultText": "Hello, world!", "translations": [ { "text": "Hello, world!", "detected_source_language": "ZH" } ] }
```

前端调用示例（可在你的 `index.html` 中使用）：
```js
const resp = await fetch('http://localhost:3001/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '你好', sourceLang: 'zh', targetLang: 'en' })
});
const data = await resp.json();
console.log(data.resultText);
```

也支持将 DeepL Key 从前端随请求传给后端（适合每个用户用自己的 Key）：  
请求体新增 `apiKey` 字段（如果没有配置服务器端的 `DEEPL_API_KEY`，则必须提供）：
```json
{
  "text": "你好，世界",
  "targetLang": "en",
  "sourceLang": "zh",
  "apiKey": "用户自己的_DeepL_Key"
}
```
注意：把 Key 存在浏览器的 localStorage 仅适用于“每个用户使用自己的 Key”的场景；如果是你自己付费的公共 Key，请放在服务端 `.env`，不要下发到浏览器。

### 待开发功能
- [ ] 翻译框大小可调
- [ ] 朗读发音功能
- [ ] 更换翻译源API

## 致谢
- [LibreTranslate](https://libretranslate.com/) – 翻译API
- [不蒜子](https://busuanzi.ibruce.info/) – 计数器

## License
MIT 

---

## Introduction
MultiTranslator is an open-source, zero-dependency web translator powered by the LibreTranslate API. The entire app lives in a single `index.html` file—no backend required. Busuanzi is integrated to display page views.

### Visit the website
[https://ahhhh2016.github.io/multi-translator/](ahhhh2016.github.io/multi-translator/)

### Features
- Translate between 6 languages (via LibreTranslate)
- Page-view counter (Busuanzi)
- One static file, easy to fork and customize

### Usage
1. Clone or download this repository.
2. Open `index.html` directly in your browser, or host it on any static service (GitHub Pages, Vercel, Netlify…).
3. Type text, choose languages, and click **Translate**.

> If the default LibreTranslate endpoint is slow or rate-limited, change the `LIBRE_URL` constant in `index.html` to your own instance.

### Optional: Backend (DeepL proxy)
If you want to use DeepL without exposing your API Key in the browser, run a tiny Node.js proxy in this repo:

1) Install deps
```
npm install
```

2) Configure env  
Copy `env.example` to `.env` and set your DeepL key:
```
DEEPL_API_KEY=your_key
```

3) Start server (defaults to port 3001)
```
npm start
```

4) API usage  
`POST http://localhost:3001/api/translate`
```json
{ "text": "你好，世界", "targetLang": "en", "sourceLang": "zh" }
```
Example response:
```json
{ "ok": true, "resultText": "Hello, world!", "translations": [ { "text": "Hello, world!", "detected_source_language": "ZH" } ] }
```

Frontend example:
```js
const resp = await fetch('http://localhost:3001/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: '你好', sourceLang: 'zh', targetLang: 'en' })
});
const data = await resp.json();
console.log(data.resultText);
```

You can also pass the DeepL key from the client per request (useful if each user uses their own key). Add `apiKey` in the request body (required when the server env `DEEPL_API_KEY` is not set):
```json
{
  "text": "你好，世界",
  "targetLang": "en",
  "sourceLang": "zh",
  "apiKey": "user_owned_deepl_key"
}
```
Note: Storing keys in the browser is only appropriate when the key belongs to the end user. If the key is yours (shared), keep it on the server side and never expose it to the client.

### Features to be developed
- [ ] Adjustable translation box size
- [ ] Read-aloud pronunciation function
- [ ] Change translation source API

## Credits
- [LibreTranslate](https://libretranslate.com/) – Translation API
- [Busuanzi](https://busuanzi.ibruce.info/) – Page-view counter

## License
MIT 

---
