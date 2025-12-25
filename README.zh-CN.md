# MultiTranslator

<p align="center">
  <img width="580" height="300" alt="image" src="/example.jpg" />
</p>

MultiTranslator 是一个极简、零依赖的网页翻译工具，支持 DeepL 与 LibreTranslate 多语言翻译，并基于浏览器原生的 Web Speech API 提供文本朗读功能。

整个应用由单个 `index.html` 文件构成，可直接打开或部署到任意静态托管平台；同时提供可选的 Vercel Serverless 后端，用于安全地代理 DeepL 请求，避免在浏览器中暴露 API Key。

在线示例：https://mt-translator.vercel.app/

---

## 项目特点

- 支持 6 种语言的互译（DeepL / LibreTranslate）
- 可选后端代理，安全使用 DeepL API
- 浏览器原生文本朗读（无需任何语音云服务）
- 单文件、零构建步骤、零运行时依赖
- 易于 fork、修改与二次开发

支持语言：
- 中文（zh）
- 英文（en）
- 日文（ja）
- 韩文（ko）
- 法文（fr）
- 德文（de）

---

## 快速使用

### 方式一：直接使用

1. 访问在线示例：https://mt-translator.vercel.app/
2. 输入文本，选择源语言与目标语言
3. 点击翻译即可

### 方式二：本地打开

1. 克隆或下载本仓库
2. 直接用浏览器打开 `index.html`
3. 无需安装依赖，无需启动服务

### 方式三：静态部署

将 `index.html` 部署到任意静态托管平台即可，例如：

- GitHub Pages
- Vercel
- Netlify
- 任意 Nginx / 静态服务器

---

## 翻译服务说明

### LibreTranslate

默认使用多个公共 LibreTranslate 实例作为翻译后端，并内置简单的失败回退机制。

如果公共实例速度慢或被限流，可以在 `index.html` 中替换备用实例列表：

```js
const endpoints = [
  'https://translate.terraprint.co/translate',
  'https://translate.fedilab.app/translate'
];
```

将其替换为你自己的 LibreTranslate 实例地址数组即可。

### DeepL（可选）

如果用户在页面中填写了自己的 DeepL API Key，将优先使用 DeepL 进行翻译。
Key 默认存储在浏览器的 `localStorage` 中，仅在本地使用。

---

## UI 与多语言支持

### 界面语言（UI）

* 支持中文与英文
* 默认根据浏览器语言自动选择
* 右上角可手动切换
* 选择结果保存在 `localStorage.ui_lang`，下次自动生效

### 翻译卡片机制

* 点击“添加”可创建新的翻译卡片
* 每个卡片可独立选择源语言与目标语言
* 不允许源语言与目标语言相同
* 不允许创建重复的语言组合卡片

---

## 可选后端：DeepL 代理（Vercel Serverless）

如果你不希望在浏览器中暴露 DeepL API Key，可以使用本仓库内置的 Serverless 后端。

### 后端功能

* 代理 DeepL 翻译请求
* API Key 仅保存在服务端环境变量中
* 支持健康检查与错误提示

### 部署到 Vercel

1. 将仓库导入 Vercel（或使用 `vercel` CLI）
2. 在项目的 Environment Variables 中设置：

```
DEEPL_API_KEY=你的DeepL密钥
```

3. 部署完成后获得地址，例如：

```
https://your-app.vercel.app
```

### 前端连接后端

* 前后端同源部署：无需任何配置
* 不同源部署：在浏览器控制台执行

```js
localStorage.setItem('backend_url', 'https://your-app.vercel.app');
```

### 本地开发（可选）

```bash
npm install -g vercel
vercel dev
```

前端配置：

```js
localStorage.setItem('backend_url', 'http://localhost:3000');
```

---

## 后端 API 说明

### 健康检查

```
GET /api/health
```

返回示例：

```json
{
  "ok": true,
  "service": "multi-translator-backend",
  "deeplKeyConfigured": true
}
```

### 翻译接口

```
POST /api/translate
```

请求体：

```json
{
  "text": "你好，世界",
  "sourceLang": "zh",
  "targetLang": "en"
}
```

返回示例：

```json
{
  "ok": true,
  "resultText": "Hello, world!"
}
```

### 使用用户自己的 DeepL Key

如果服务端未配置 `DEEPL_API_KEY`，可在请求体中传入：

```json
{
  "text": "你好，世界",
  "sourceLang": "zh",
  "targetLang": "en",
  "apiKey": "用户自己的DeepL密钥"
}
```

注意：

* 仅适用于“每个用户使用自己的 Key”的场景
* 公共或付费 Key 请务必只放在服务端

---

## 文本朗读（Text-to-Speech）

MultiTranslator 使用浏览器原生的 Web Speech API（`speechSynthesis`）实现文本朗读。

### 使用方式

* 输入框与结果框均提供朗读按钮
* 点击开始朗读，再次点击可停止
* 删除卡片或重新翻译时，朗读会自动终止

### 语言与语音选择

* 根据语言代码自动匹配语音（如 `zh-CN`, `en-US`）
* 优先使用系统中可用的高质量语音
* 若无完全匹配语音，将回退到系统默认

### 兼容性说明

* 推荐使用最新版 Chrome、Edge 或 Safari
* 移动端首次朗读可能需要等待语音资源加载
* 朗读完全在本地完成，不会上传文本内容

---

## 常见问题

* 翻译失败：可能是公共 LibreTranslate 实例限流或网络问题
* DeepL 502 错误：通常与 API Key 或网络波动有关
* 无法朗读：请确认浏览器支持 Web Speech API

---

## 致谢

* LibreTranslate：开源翻译 API
* Busuanzi：页面访问统计

---

## License

MIT
