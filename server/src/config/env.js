// 集中读取环境变量。其它代码只从这里取配置，不直接读 process.env，
// 方便统一管理和未来扩展。
import 'dotenv/config';

export const cfg = {
  port: Number(process.env.PORT) || 3001,

  // LLM 选择：claude | openai | deepseek | mock（缺省 mock = 纯本地规则）
  llmProvider: (process.env.LLM_PROVIDER || 'mock').toLowerCase(),

  anthropicKey: process.env.ANTHROPIC_API_KEY || '',
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-6',

  openaiKey: process.env.OPENAI_API_KEY || '',
  openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',

  deepseekKey: process.env.DEEPSEEK_API_KEY || '',
  deepseekModel: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
};

// 当前是否真正具备 AI 能力（用于前端提示"AI 讲解 / 本地讲解"）
export function aiEnabled() {
  if (cfg.llmProvider === 'claude') return !!cfg.anthropicKey;
  if (cfg.llmProvider === 'openai') return !!cfg.openaiKey;
  if (cfg.llmProvider === 'deepseek') return !!cfg.deepseekKey;
  return false;
}
