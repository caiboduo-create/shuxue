import { Router } from 'express';
import { listCurriculum, listTopics, GRADES } from '../knowledge/index.js';
import { generateQuestion } from '../engine/generator.js';
import { judge } from '../engine/judge.js';
import { explain } from '../engine/explain.js';
import { photoSolve } from '../engine/photoSolve.js';
import { aiEnabled, cfg } from '../config/env.js';

const router = Router();

// 把 async 路由的错误统一交给错误处理中间件
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// 元信息：年级列表 + 当前是否启用 AI 讲解
router.get('/meta', (req, res) => {
  res.json({
    grades: GRADES,
    aiEnabled: aiEnabled(),
    provider: aiEnabled() ? cfg.llmProvider : 'local',
  });
});

// 某年级的知识点列表
router.get('/topics', (req, res) => {
  res.json({ topics: listTopics(req.query.grade) });
});

// 某年级的教材目录：上/下册 -> 单元 -> 已接入知识点
router.get('/curriculum', (req, res) => {
  res.json(listCurriculum(req.query.grade));
});

// 出题
router.post(
  '/question',
  wrap((req, res) => {
    const { topicId, difficulty, placementId, topicTitle } = req.body || {};
    if (!topicId) return res.status(400).json({ error: '缺少参数 topicId' });
    res.json({ question: generateQuestion(topicId, difficulty, { placementId, topicTitle }) });
  })
);

// 判题
router.post(
  '/judge',
  wrap((req, res) => {
    const { topicId, params, userAnswer } = req.body || {};
    if (!topicId || params === undefined)
      return res.status(400).json({ error: '缺少参数 topicId 或 params' });
    res.json(judge(topicId, params, userAnswer));
  })
);

// 讲解（AI 或规则）
router.post(
  '/explain',
  wrap(async (req, res) => {
    const { topicId, params, stem } = req.body || {};
    if (!topicId || params === undefined)
      return res.status(400).json({ error: '缺少参数 topicId 或 params' });
    res.json(await explain(topicId, params, { stem }));
  })
);

// AI 拍照答题：上传图片，识别题目并生成答案讲解
router.post(
  '/photo-solve',
  wrap(async (req, res) => {
    const { imageData, note } = req.body || {};
    if (!imageData) return res.status(400).json({ error: '请先上传题目图片' });
    res.json(await photoSolve({ imageData, note }));
  })
);

export default router;
