import express from 'express';
import cors from 'cors';
import { cfg, aiEnabled } from './config/env.js';
import api from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '12mb' }));

app.get('/', (req, res) => res.json({ ok: true, service: 'math-ai-server' }));
app.use('/api', api);

// 统一错误处理：永远返回明确信息，不静默失败
app.use((err, req, res, next) => {
  console.error('[error]', err.message);
  res.status(err.status || 500).json({ error: err.message || '服务器内部错误' });
});

app.listen(cfg.port, () => {
  console.log(`\n  数学 AI 后端已启动  →  http://localhost:${cfg.port}`);
  console.log(`  讲解模式：${aiEnabled() ? `AI（${cfg.llmProvider}）` : '本地规则（未配置 API Key）'}\n`);
});
