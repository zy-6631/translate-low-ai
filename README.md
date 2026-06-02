# 中→英 智能翻译小程序

基于微信小程序 + DeepSeek API 的中译英翻译工具，核心特色是**低AI检测率**——翻译结果自然流畅，不易被AI检测工具识别。

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
├── miniprogram/              # 微信小程序前端
│   ├── pages/index/          # 翻译主页
│   ├── pages/history/        # 历史记录页
│   ├── components/result-card/  # 结果卡片组件
│   └── utils/                # 工具模块（云调用/剪贴板）
├── cloudfunctions/translate/ # 翻译云函数
│   └── prompts/              # 核心Prompt（翻译/检测/改写）
└── project.config.json
```

## 快速开始

### 1. 前提条件
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) 最新版
- 微信小程序 AppID（在 [微信公众平台](https://mp.weixin.qq.com/) 注册）
- 开通**微信云开发**（云函数 + 云数据库）
- [DeepSeek API Key](https://platform.deepseek.com/)

### 2. 配置

1. 将 `project.config.json` 中的 `YOUR_APPID_HERE` 替换为你的 AppID
2. 将 `miniprogram/app.ts` 中的 `YOUR_CLOUD_ENV_ID` 替换为云开发环境ID
3. 在云函数环境变量中设置 `DEEPSEEK_API_KEY`

### 3. 部署云函数

在微信开发者工具中：
- 右键 `cloudfunctions/translate` → **上传并部署：云端安装依赖**

### 4. 创建数据库集合

在云开发控制台 → 数据库 → 创建集合 `translations`，权限设为「仅创建者可读写」。

### 5. 运行

在微信开发者工具中点击「编译」，即可在模拟器中预览。

## 设计说明

- **翻译策略**：角色扮演（15年翻译专家）+ 意译优先 + 句式多变 + 禁止AI过渡词
- **检测维度**：句式均匀度 / 过渡词模式 / 翻译腔 / 自然度 / 词汇多样性
- **改写策略**：仅针对性修改问题部分，而非全部重写（模拟真人编辑行为）
- **改写阈值**：AI评分 > 40 分自动触发

## 依赖

- 微信小程序原生框架
- 微信云开发（云函数 Node.js 18 + 云数据库）
- DeepSeek API (`deepseek-chat` 模型)
