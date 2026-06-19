// 统一 LLM Provider 抽象层
// 通过 .env 的 LLM_PROVIDER 切换：claude | openai | deepseek | mock
// 任何 provider 都暴露同一个方法：chat({ system, messages }) -> string
// 没有配置 API Key 时自动退回 mock，让系统不崩溃（改用本地规则讲解）。

import { cfg } from '../config/env.js';

class MockProvider {
  available = false;
  async chat() {
    throw new Error('NO_LLM'); // 信号：上层应回退到规则讲解
  }
}

// Claude（Anthropic）官方 Messages API
class ClaudeProvider {
  constructor(key, model) {
    this.key = key;
    this.model = model || 'claude-sonnet-4-6';
    this.available = !!key;
  }
  async chat({ system, messages }) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': this.key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({ model: this.model, max_tokens: 1500, system, messages }),
    });
    if (!res.ok) throw new Error(`Claude API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return (data.content || []).map((b) => b.text || '').join('\n');
  }
}

// OpenAI 兼容接口（OpenAI / DeepSeek 共用，靠 baseURL 区分）
class OpenAICompatProvider {
  constructor({ key, model, baseURL }) {
    this.key = key;
    this.model = model;
    this.baseURL = baseURL;
    this.available = !!key;
  }
  async chat({ system, messages }) {
    const res = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${this.key}` },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 1500,
        messages: [{ role: 'system', content: system }, ...messages],
      }),
    });
    if (!res.ok) throw new Error(`LLM API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  }
}

let cached;

export function getProvider() {
  if (cached) return cached;
  const p = cfg.llmProvider;
  if (p === 'claude' && cfg.anthropicKey) {
    cached = new ClaudeProvider(cfg.anthropicKey, cfg.claudeModel);
  } else if (p === 'openai' && cfg.openaiKey) {
    cached = new OpenAICompatProvider({
      key: cfg.openaiKey,
      model: cfg.openaiModel || 'gpt-4o-mini',
      baseURL: 'https://api.openai.com/v1',
    });
  } else if (p === 'deepseek' && cfg.deepseekKey) {
    cached = new OpenAICompatProvider({
      key: cfg.deepseekKey,
      model: cfg.deepseekModel || 'deepseek-chat',
      baseURL: 'https://api.deepseek.com/v1',
    });
  } else {
    cached = new MockProvider(); // 没 key 或未配置 -> 走规则讲解
  }
  return cached;
}
