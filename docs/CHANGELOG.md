# 网页版 (PWA) 开发日志

## 2026-06-02 — 项目初始化

### 转换原因
- 微信小程序需要 AppID 认证（企业 300元/年）
- 云开发环境配置复杂，需要上传部署云函数
- 审核流程繁琐，迭代周期长

### 技术方案
- **单文件 PWA**：HTML + CSS + JS 全部内联，零依赖
- **直接调用 DeepSeek API**：浏览器端直连，无需后端/云函数
- **localStorage 持久化**：翻译历史本地存储，无需云数据库
- **PWA 可安装**：手机端添加到桌面，体验接近原生 App
- **响应式设计**：一套代码适配手机/平板/桌面

### 相比小程序的变化

| 方面 | 微信小程序 | 网页 PWA |
|------|-----------|----------|
| 审核 | 需要微信审核 | 无需审核 |
| 费用 | 认证费 300元/年 | 0 元 |
| 部署 | 微信云开发 | 静态文件托管（GitHub Pages / Vercel 等） |
| 后端 | 云函数 | 无（直连 DeepSeek） |
| 数据库 | 云数据库 | localStorage |
| API Key | 环境变量 | 用户自行配置（localStorage） |
| 分享 | 微信生态内分享 | URL 链接分享 |

### 保留的核心功能
- ✅ 三步翻译流水线（翻译 → 检测 → 改写）
- ✅ DeepSeek API 调用
- ✅ AI 痕迹五维度评分
- ✅ 翻译历史记录（搜索 + 筛选）
- ✅ 质量等级可视化（A-E 分段指示条）
- ✅ 快捷建议标签
- ✅ 流水线进度动画
- ✅ 复制译文/原文
- ✅ 波状微交互反馈

### 移除/调整的功能
- ❌ 微信云开发 → 直连 API + localStorage
- ❌ 微信振动反馈 → CSS 动画反馈
- ❌ 底部 TabBar → 顶部 Tab 切换
- ❌ 微信左滑删除手势 → 长按删除
- ❌ 微信组件系统 → 原生 DOM 操作

---

## 文件清单

```
docs/
├── index.html          # 主应用（单文件 PWA）
├── manifest.json        # PWA 清单
├── sw.js               # Service Worker（离线缓存）
└── CHANGELOG.md        # 本文件
```

---

## 2026-06-02 — GitHub Pages 部署

### 部署步骤

1. **重命名文件夹**：`web/` → `docs/`（GitHub Pages 要求）
2. **初始化 Git 仓库**：`git init` → `git add .` → `git commit`
3. **创建 GitHub 仓库**：https://github.com/zy-6631/translate-low-ai
4. **关联远程并推送**：
   ```bash
   git remote add origin https://github.com/zy-6631/translate-low-ai.git
   git branch -M main
   git push -u origin main
   ```
5. **启用 GitHub Pages**：Settings → Pages → 选 `main` 分支 + `/docs` 目录 → Save

### 访问地址

👉 https://zy-6631.github.io/translate-low-ai/

### 使用流程
1. 打开上述网址
2. 首次访问弹出设置面板，填入 DeepSeek API Key（在 [platform.deepseek.com](https://platform.deepseek.com) 免费获取）
3. API Key 存储在浏览器 localStorage 中，每个用户独立配置
4. 输入中文 → 点击翻译，三步流水线自动执行
5. 翻译历史自动保存，支持搜索和筛选

### 技术细节
- **无后端**：浏览器直连 DeepSeek API，无需任何服务器
- **PWA 可安装**：手机浏览器打开后，可添加到桌面，体验接近 App
- **离线可用**：Service Worker 缓存核心文件，断网也能打开页面
- **零成本运行**：GitHub Pages 免费托管，DeepSeek API 新用户有免费额度
