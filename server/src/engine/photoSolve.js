import { cfg } from '../config/env.js';

function stripCodeFence(text) {
  return text.replace(/```json/gi, '').replace(/```/g, '').trim();
}

function fallbackResult() {
  return {
    source: 'setup',
    title: '拍照答题接口已经准备好',
    question: '',
    answer: '',
    steps: [
      '前端已经可以拍照或上传题目图片。',
      '后端已经预留 /api/photo-solve 接口。',
      '配置 OPENAI_API_KEY 后，这里会返回题目识别、答案和分步讲解。',
    ],
    summary: '现在缺少 OPENAI_API_KEY，所以先显示接口准备状态。你之后配置好 Key，再重启后端即可启用 AI 解析。',
  };
}

function normalizeImageData(imageData) {
  if (typeof imageData !== 'string' || !imageData.startsWith('data:image/')) {
    const err = new Error('请上传有效的图片');
    err.status = 400;
    throw err;
  }
  if (imageData.length > 10_000_000) {
    const err = new Error('图片太大了，请裁剪后再上传');
    err.status = 413;
    throw err;
  }
  return imageData;
}

export async function photoSolve({ imageData, note }) {
  const imageUrl = normalizeImageData(imageData);

  if (!cfg.openaiKey) {
    return fallbackResult();
  }

  const prompt = `你是一位耐心的小学和初中数学老师。请识别图片中的数学题，并用中文回答。
要求：
1. 先准确抄出题目。如果图片里有多题，优先解最清楚的一题；用户有补充说明时按补充说明来。
2. 给出答案。
3. 用适合中小学生的方式分步讲解。
4. 如果图片不清楚，直接说明哪里看不清，并给出重新拍照建议。
只返回 JSON，不要返回 Markdown。JSON 格式：
{
  "title": "简短标题",
  "question": "识别到的题目",
  "answer": "答案",
  "steps": ["第一步", "第二步"],
  "summary": "一句话总结"
}

用户补充说明：${note || '无'}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${cfg.openaiKey}`,
    },
    body: JSON.stringify({
      model: cfg.openaiModel || 'gpt-4o-mini',
      max_tokens: 1800,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI 图片解析失败 ${res.status}: ${await res.text()}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';
  const parsed = JSON.parse(stripCodeFence(content));

  return {
    source: 'openai',
    title: parsed.title || 'AI 解析结果',
    question: parsed.question || '',
    answer: parsed.answer || '',
    steps: Array.isArray(parsed.steps) ? parsed.steps : [],
    summary: parsed.summary || '',
  };
}
