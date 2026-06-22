import { getTopic } from '../knowledge/index.js';
import { getProvider } from '../llm/provider.js';
import { explanationPrompt } from '../prompts/index.js';

// 讲解引擎：与出题/判题分离
// 策略：先由知识点模块给出"规则讲解骨架"（一定能用），
// 若配置了可用的 LLM，再让它在骨架基础上润色成更生动的版本；
// 任何 AI 失败都安全回退到规则讲解，绝不让接口崩溃。

function answerText(topic, params) {
  const sol = topic.solve(params);
  if (sol.correctValue !== undefined) return String(sol.correctValue);
  return String(sol.answer);
}

export async function explain(topicId, params, { stem } = {}) {
  const topic = getTopic(topicId);
  if (!topic) {
    const err = new Error(`找不到知识点：${topicId}`);
    err.status = 404;
    throw err;
  }

  // 1) 规则讲解（基础保障）
  const rule = topic.explain(params);
  const ansText = answerText(topic, params);
  const base = {
    source: 'rule',
    answer: ansText,
    steps: rule.steps || [],
    whyItWorks: rule.whyItWorks || '',
    commonMistakes: rule.commonMistakes || [],
    optionAnalysis: rule.optionAnalysis || [],
    summary: rule.summary || '',
  };

  // 低年级或教材位置敏感的题目，直接使用规则讲解，避免 AI 润色时引入超纲术语。
  if (rule.aiPolish === false) return base;

  // 2) 尝试 AI 润色
  const provider = getProvider();
  if (!provider.available) return base;

  try {
    const { system, messages } = explanationPrompt({
      question: { stem: stem || topic.llmContext?.(params) || '' },
      ruleSkeleton: { answerText: ansText, skeleton: rule },
    });
    const raw = await provider.chat({ system, messages });
    const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      source: 'ai',
      answer: ansText, // 答案以系统计算为准，不信任 AI 改答案
      steps: Array.isArray(parsed.steps) ? parsed.steps : base.steps,
      whyItWorks: parsed.whyItWorks || base.whyItWorks,
      commonMistakes: Array.isArray(parsed.commonMistakes)
        ? parsed.commonMistakes
        : base.commonMistakes,
      optionAnalysis: Array.isArray(parsed.optionAnalysis)
        ? parsed.optionAnalysis
        : base.optionAnalysis,
      summary: parsed.summary || base.summary,
    };
  } catch (e) {
    // AI 出错 -> 安全回退到规则讲解，并在日志里留痕
    console.warn('[explain] AI 讲解失败，回退规则讲解：', e.message);
    return base;
  }
}
