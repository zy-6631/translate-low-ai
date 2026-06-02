# 网页版 (PWA) 开发日志

## 2026-06-02 — 优化翻译AI率底层逻辑：升级三阶段Prompt与检测流水线

### 背景
在实际使用中发现，翻译产出的英文文本在 Copyleaks 等 AI 检测工具中仍有较高识别率。分析多篇被标记为不同AI率（32.9% - 100%）的英文文本后，总结出AI检测工具的核心判据，对翻译流水线进行全面升级。

### 参数调整

| 参数 | 旧值 | 新值 | 说明 |
|------|------|------|------|
| `AI_THRESHOLD` | 40 | 25 | 更积极地触发改写 |
| `TEMP_TRANSLATE` | 0.7 | 0.75 | 初始翻译增加多样性 |
| `TEMP_REWRITE` *(新)* | — | 0.85 | 改写使用更高温度 |
| `AI_THRESHOLD_CRITICAL` *(新)* | — | 60 | 超过此值触发深度改写 |

### 翻译 Prompt 升级
- **新增反AI检测策略层**：
  - 强制句式破坏（相邻3句长度差异明显）
  - 禁用 `This means/ensures/allows/makes` 开头的句子
  - 禁用 `is + 程度副词 + adj` 模式
  - 段落变形、禁用标题大小写、禁用FAQ/列表模板
  - 打破「总结感」结尾

### 检测 Prompt 升级：4维度 → 7维度

| 维度 | 权重 | 变更 |
|------|------|------|
| 句式均匀度 | 30%→20% | 强化句长差异和开头方式检测 |
| 过渡词与连接词 | 20%→15% | 扩展至段落开头模式检测 |
| 翻译腔特征 | 25%→15% | 新增被动语态密度阈值（>30%） |
| **模板化短语** *(新)* | 15% | `This + verb` 链、AI高频搭配、解释性结构重复 |
| **结构模板化** *(新)* | 15% | FAQ模式、编号列表、段落均匀度、标题大小写、模板开头/结尾 |
| 自然度 | 25%→10% | 习语、缩写、口语化、词汇变化 |
| **信息密度比** *(新)* | 10% | 实义信息 vs 填充性文字的比率 |

### 改写 Prompt 重构
从「温和微调」彻底重构为 **5层外科手术式去AI策略**：

1. **句子手术**（最高优先级）：强制长短穿插、拆分模板句、合并碎片句
2. **词汇替换**：内置 AI过渡词→自然表达 替换表（Moreover→Plus / Therefore→So / However→But）
3. **结构破坏**：段落长度打散、打破平行结构、消灭模板开头结尾
4. **添加人类特征**：口语化插入、自然不精确、自我打断破折号
5. **信息密度提升**：删除填充句、合并稀释句

### 流水线逻辑升级

```
旧: 翻译 → 检测 → (score>40?) 改写 → 完成
新: 翻译 → 检测 → (score>25?) 改写 → 二次检测 → (score>60?) 深度改写 → 完成
```

- 改写后自动再次检测AI分
- 若仍超过 60 分，使用更高温度 (0.95) 进行第二轮深度改写
- 每一步检测返回的结果包含 `pattern_level` 和 `rewrite_priority` 字段

### 提交记录
- `065b796` — 优化翻译AI率底层逻辑：升级三阶段Prompt与流水线
- `def7bfb` — 更新 README 反映最新的流水线和检测维度变更

---

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

---

## 2026-06-02 — 清理项目 & 部署确认

### 操作内容
- **提交变更**：移除所有微信小程序相关文件（`miniprogram/`、`cloudfunctions/`、`project.config.json` 等），共删除 31 个文件、3170 行代码
- **更新 README**：补充项目结构、部署方案（GitHub Pages / 本地运行）、使用流程、技术方案等完整文档
- **更新 CHANGELOG**：记录从微信小程序到网页 PWA 的完整转换过程

### 提交记录
- `90378c8` — 移除小程序代码，项目转为纯网页 PWA

### 部署说明
- **仓库地址**：https://github.com/zy-6631/translate-low-ai
- **部署方式**：GitHub Pages（Settings → Pages → Source: Deploy from a branch → main + /docs）
- **访问地址**：https://zy-6631.github.io/translate-low-ai/（启用 GitHub Pages 后生效）
- **用户使用**：任何人直接打开网址即可使用，无需下载、无需 GitHub 账号
- **与仓库的关系**：GitHub Pages 网址展示的是翻译 App 界面，不是代码文件列表

### GitHub Pages vs 仓库
| | 仓库页面 | Pages 网址 |
|---|---|---|
| 地址 | github.com/zy-6631/translate-low-ai | zy-6631.github.io/translate-low-ai/ |
| 看到什么 | 代码文件 | 翻译 App 界面 |
| 需要账号 | 不需要 | 不需要 |
| 需要下载 | 不需要 | 不需要 |
