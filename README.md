# 中→英 智能翻译 PWA

基于 DeepSeek API 的中译英翻译工具，核心特色是**低 AI 检测率**——翻译结果自然流畅，不易被 AI 检测工具识别。

## 核心技术：三步流水线

```
输入中文
  → [第1步] 拟人化翻译（深度提示词工程）
  → [第2步] AI痕迹检测（五维度评分）
  → [第3步] 超标自动改写（针对性去AI化）
  → 输出自然英文
```

## 项目结构

```
translate-miniapp/
├── docs/
│   ├── index.html        # 主应用（单文件 PWA）
│   ├── manifest.json     # PWA 清单
│   ├── sw.js            # Service Worker（离线缓存）
│   └── CHANGELOG.md     # 开发日志
└── README.md
```

## 快速开始

### 1. 前提条件

- [DeepSeek API Key](https://platform.deepseek.com/)（免费注册即可获取）

### 2. 部署

**方案 A：GitHub Pages（推荐）**
1. Fork 本仓库
2. Settings → Pages → 选 `main` 分支 + `/docs` 目录 → Save
3. 等待几分钟即可通过 `https://<你的用户名>.github.io/translate-miniapp/` 访问

**方案 B：本地运行**
1. 在项目目录下启动任意静态文件服务器，例如：
   ```
   npx serve docs
   ```
2. 浏览器打开 `http://localhost:3000`

### 3. 使用

1. 打开网页，首次访问会弹出设置面板
2. 填入 DeepSeek API Key（存储在浏览器 localStorage 中）
3. 输入中文 → 点击翻译，三步流水线自动执行
4. 翻译历史自动保存在本地

## 技术方案

- **单文件 PWA**：HTML + CSS + JS 全部内联，零依赖
- **直连 DeepSeek API**：浏览器端直连，无需后端/云函数
- **localStorage 持久化**：翻译历史本地存储
- **PWA 可安装**：手机端添加到桌面，体验接近原生 App
- **响应式设计**：一套代码适配手机/平板/桌面

## 设计说明

- **翻译策略**：角色扮演（15年翻译专家）+ 意译优先 + 句式多变 + 禁止AI过渡词
- **检测维度**：句式均匀度 / 过渡词模式 / 翻译腔 / 自然度 / 词汇多样性
- **改写策略**：仅针对性修改问题部分，而非全部重写（模拟真人编辑行为）
- **改写阈值**：AI评分 > 40 分自动触发

## 依赖

- DeepSeek API（`deepseek-chat` 模型）
- 现代浏览器（支持 Service Worker、Fetch API）
