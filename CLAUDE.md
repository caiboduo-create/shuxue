# CLAUDE.md

本文件给 Claude Code（或任何 AI 协作者）提供项目规范，便于继续迭代。请在动代码前先读这里。

## 项目是什么

面向小学 1–6 年级和初中的「AI 数学学习与出题系统」。前后端分离：

- `server/`：Node + Express。出题 / 判题 / 讲解三套引擎分离，知识点模块化，LLM Provider 抽象，prompt 独立管理。端口 3001。
- `web/`：React 18 + Vite。年级 / 知识点 / 答题 / 讲解 / 错题本 / 进度共 7 个页面。端口 5173，通过 vite proxy 把 `/api` 转发到后端。

## 核心设计约定（改代码务必遵守）

1. **三引擎分离**：出题（`engine/generator.js`）、判题（`engine/judge.js`）、讲解（`engine/explain.js`）各司其职，不要把逻辑混在一起。
2. **答案绝不下发前端**：`generator` 返回的题目只含 `stem / options / visual / params`，**不含答案**。前端答题时把 `params` 原样回传，后端用 `topic.solve(params)` 重新求解再判题（无状态判题）。
3. **题目与知识点严格匹配**：每个知识点是自包含模块，只出自己范围内的题。**绝不允许**出现「概率知识点下出几何题」这类错位。
4. **不静默失败**：出错要抛带 `status` 的 Error，由统一中间件返回明确信息。
5. **无 API Key 也能跑**：讲解默认走本地规则骨架；配了可用 LLM 才在骨架上润色，AI 任何失败都安全回退规则讲解。答案始终以系统计算为准，不信任 AI 改答案。
6. **中文优先**：所有面向学生/家长的文案用中文，讲解风格像老师上课，不堆术语。

## 如何新增一个知识点（最常见的扩展）

1. 在 `server/src/knowledge/topics/` 下新建一个模块文件，默认导出一个对象，**必须**实现以下契约：

```js
export default {
  id: 'your-topic-id',          // 唯一英文 id
  title: '中文标题',
  category: '数与运算 | 图形与几何 | 方程与代数 | 统计与概率 | ...',
  grades: [4, 5],               // 适用年级
  difficulties: ['easy', 'medium', 'hard'],

  // 出题：返回题目，绝不含答案。可选 options（选择题）、visual（几何图示）、stemVariants/多模板
  generate(difficulty) {
    return { type: 'numeric'|'choice'|'text', stem, options?, visual?, params };
  },

  // 求解：根据 params 重新算出答案。选择题返回 { correctValue }，其余返回 { answer }
  solve(params) { return { answer } /* 或 { correctValue } */; },

  // 规则讲解骨架（一定能用，不依赖 AI）
  explain(params) {
    return { steps:[{title,detail}], whyItWorks, commonMistakes:[], optionAnalysis:[], summary };
  },

  // 给 LLM 的上下文（可选，用于 AI 润色）
  llmContext(params) { return '一句话描述这道题'; },
};
```

2. 在 `server/src/knowledge/index.js` 里 `import` 并加入 `TOPICS` 数组。完成——它会自动出现在对应年级的列表里。

3. 若是几何题需要配图，在 `generate` 里返回 `visual: { kind: 'xxx', ... }`，并在前端 `web/src/components/GeometrySVG.jsx` 里加一个对应 `kind` 的渲染分支。现有 `kind`：`line` / `angle` / `rect` / `symmetry` / `points`。

4. **多问法约定**：同一知识点尽量提供多套问法模板（见 `add-sub.js`、`linear-eq.js` 的 `STEMS` 写法），避免题目语义单一。引擎层已对所有知识点做了「防连续重复」。

## 接入 / 切换大模型

- 复制 `server/.env.example` 为 `server/.env`，设 `LLM_PROVIDER=claude|openai|deepseek|mock` 与对应 Key。
- Provider 抽象在 `server/src/llm/provider.js`；prompt 在 `server/src/prompts/index.js`。**不要把 prompt 写死进业务代码**。

## 常用命令

```bash
# 安装
cd server && npm install
cd web && npm install

# 启动（两个终端）
cd server && npm run dev     # 后端 3001
cd web && npm run dev        # 前端 5173

# 前端构建自检（确认无编译错误）
cd web && npx vite build
```

## 提交规范

- 用中文、清晰的 commit message，遵循 `feat: / fix: / chore: / docs:` 前缀。
- 一个 commit 只做一件事，便于回溯。
