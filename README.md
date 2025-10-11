# MultiTranslator / 多语言网页翻译工具

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
