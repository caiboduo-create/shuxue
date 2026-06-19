# 数学小课堂 · AI 数学学习与出题系统

面向**小学和初中**的数学练习产品：自动出题、自动判题、像老师一样分步骤讲解、几何题配 SVG 图、错题记录、按薄弱点继续练。

没有配置任何 AI Key 也能完整运行（使用内置的本地规则讲解）；配置了 Claude / OpenAI / DeepSeek 的 Key 后，讲解会自动升级为 AI 版本。

---

## 一、主要功能

- **自动出题**：每个知识点都是独立的出题模块，支持多种问法、随机参数、三档难度（简单 / 中等 / 困难），不是固定模板。
- **自动判题**：支持选择题、填空数值题、分数题（如概率 `1/3` 与 `2/6` 视为相等）。
- **分步讲解**：标准答案 + 分步骤 + 为什么这样做 + 常见错误 + 选项解析 + 思路总结。
- **图文并茂**：线段/射线/直线、角、周长、面积等几何题用 SVG 画出清晰图形。
- **错题记录**：做错的题自动进入错题本，可重练、可移除。
- **学习进度**：统计总正确率和各知识点掌握情况，自动找出薄弱点并建议针对性练习。
- **AI 接口可切换**：通过 `.env` 在 Claude / OpenAI / DeepSeek 之间切换，无 Key 自动退回本地讲解。

> **v2 更新（refactor/math-ai-v2 分支）**：新增「对称轴」「平面直角坐标系中两点间距离」两个知识点（共 11 个，含 SVG 图示）；出题引擎加入「防连续重复」机制并扩充多问法模板；新增 `CLAUDE.md` 便于用 Claude Code 继续迭代。

---

## 二、技术栈与目录结构

前后端分离：后端 Node + Express，前端 React + Vite。

```
math-ai/
├── server/                 # 后端：出题 / 判题 / 讲解 / AI 接口
│   ├── src/
│   │   ├── knowledge/      # 知识点模块（每个知识点一个文件，自带出题/解题/讲解）
│   │   │   ├── index.js    # 知识点注册中心
│   │   │   └── topics/     # add-sub / angles / probability-basic ...
│   │   ├── engine/         # generator(出题) / judge(判题) / explain(讲解) —— 三者分离
│   │   ├── llm/            # LLM Provider 抽象层（claude/openai/deepseek/mock）
│   │   ├── prompts/        # 统一 Prompt 管理层（提示词不写死在业务里）
│   │   ├── config/         # 环境变量读取
│   │   └── routes/         # API 路由
│   └── .env.example
└── web/                    # 前端：页面与交互
    └── src/
        ├── pages/          # 首页/年级/知识点/答题/错题本/进度
        ├── components/     # GeometrySVG(几何图) / ExplainView(讲解)
        └── lib/            # api(接口封装) / store(本地存储)
```

> **为什么不会"概率题里冒出三角形"**：每个知识点是一个自包含模块，自己负责出题、解题、讲解、配图。概率模块只会产出概率内容，从架构上杜绝了知识点与题目错位。

---

## 三、快速开始

需要先安装 [Node.js](https://nodejs.org) 18 或更高版本（推荐 20+）。

### 方式 A：分别启动前端和后端（推荐，能看清两边日志）

**1）启动后端**（终端 1）

```bash
cd server
npm install
npm run dev
```

看到 `数学 AI 后端已启动 → http://localhost:3001` 即成功。

**2）启动前端**（终端 2，新开一个终端窗口）

```bash
cd web
npm install
npm run dev
```

浏览器打开 **http://localhost:5173** 即可使用。

> 前端已配置代理，所有 `/api` 请求会自动转发到后端 3001 端口，无需关心跨域。

### 方式 B：一条命令同时启动两边

在项目根目录执行：

```bash
npm install            # 安装 concurrently
npm run install:all    # 安装前后端依赖
npm run dev            # 同时启动前端 + 后端
```

---

## 四、配置 AI 讲解（可选）

不配置也能用——默认走本地规则讲解。想启用 AI 讲解时：

```bash
cd server
cp .env.example .env
```

然后编辑 `.env`，二选一填写，例如用 DeepSeek：

```ini
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=你的key
```

或用 Claude：

```ini
LLM_PROVIDER=claude
ANTHROPIC_API_KEY=你的key
```

重启后端即可。首页会显示当前讲解模式（AI 或本地）。

> **没有 API Key 怎么办？** 完全不影响使用。`LLM_PROVIDER=mock`（默认）时，所有讲解由内置规则生成；即使配了 Key 但调用失败，也会自动回退到本地讲解，不会报错崩溃。

---

## 五、如何添加新知识点

这是本项目最容易扩展的地方，**两步**即可：

1. 在 `server/src/knowledge/topics/` 下新建一个文件，参考现有模块导出一个对象：

```js
export default {
  id: 'symmetry',
  title: '轴对称',
  category: '图形与几何',
  grades: [4, 5],
  difficulties: ['easy', 'medium', 'hard'],
  generate(difficulty) { /* 返回 { type, stem, options?, visual?, params } */ },
  solve(params)       { /* 返回 { answer } 或 { correctValue } */ },
  explain(params)     { /* 返回 { steps, whyItWorks, commonMistakes, summary } */ },
  llmContext(params)  { /* 给 AI 的一句话描述 */ },
};
```

2. 在 `server/src/knowledge/index.js` 里 `import` 并加进数组。

完成后它会自动出现在对应年级的知识点列表里。

---

## 六、后续开发路线

- [ ] 扩充知识点：对称轴、点到线距离、图形关系、反向推理题、分数/小数运算、初中函数与几何证明等。
- [ ] 题目去重与"同类题不连续出现"策略。
- [ ] 用户账号 + 后端数据库（把错题本/进度从浏览器迁到云端，支持多端同步）。
- [ ] OCR 拍照解题、语音讲题。
- [ ] 动画讲课版（分步动画演示解题过程）。
- [ ] 家长端报告：定期生成孩子的学习情况总结。

---

## 七、推到 GitHub / 用 Claude Code 继续迭代

把这个项目上传到你的仓库：

```bash
cd math-ai
git init
git add .
git commit -m "feat: 数学 AI 学习系统 MVP（出题/判题/讲解/几何图/错题/进度）"
git branch -M main
git remote add origin <你的仓库地址>
git push -u origin main
```

之后想让 AI 直接在仓库里帮你改代码、提交，推荐在你的 Mac 上安装 **Claude Code**（命令行工具），它能用你的 Claude 订阅登录、读写整个项目、自动生成 commit：

```bash
# 安装
npm install -g @anthropic-ai/claude-code
# 在项目目录里启动
cd math-ai && claude
```
