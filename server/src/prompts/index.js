// 统一 Prompt 管理层
// 所有发给大模型的提示词都集中在这里，方便统一维护、调优、做 A/B 测试。
// 业务代码（engine）只调用这些函数，不直接拼 prompt 字符串。

// 讲解类提示词：让模型像老师一样，输出结构化 JSON
export function explanationPrompt({ question, ruleSkeleton }) {
  const system = `你是一位耐心、专业的中小学数学老师。请用适合学生理解的语言讲解题目，避免冷冰冰只给答案。
要求：
1. 讲解像上课，循循善诱，但不啰嗦。
2. 严格服从参考讲解骨架的知识范围，不要主动引入骨架里没有出现的高年级方法或术语。
3. 对低年级简单题，可以只给答案和一句很短的说明，不要硬凑步骤。
4. 必须严格只输出 JSON，不要任何多余文字、不要 Markdown 代码块标记。
5. JSON 结构如下：
{
  "steps": [{"title": "步骤标题", "detail": "这一步在做什么、为什么这样做"}],
  "whyItWorks": "这道题背后的数学道理",
  "commonMistakes": ["学生常犯的错误1", "错误2"],
  "optionAnalysis": [{"label": "选项内容", "correct": true/false, "reason": "为什么对/错"}],
  "summary": "一句话解题思路总结"
}
若题目没有选项，则 optionAnalysis 返回空数组 []。`;

  const user = `题目：${question.stem}

正确答案：${ruleSkeleton.answerText}

这是一份参考讲解骨架（你可以基于它写得更生动、更适合学生，但答案必须与上面一致）：
${JSON.stringify(ruleSkeleton.skeleton, null, 2)}

请输出讲解 JSON。`;

  return { system, messages: [{ role: 'user', content: user }] };
}
