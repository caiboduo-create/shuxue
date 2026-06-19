import { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api.js';
import { addWrong, recordAnswer, resolveWrong } from '../../lib/store.js';
import GeometrySVG from '../GeometrySVG.jsx';
import ExplainView from '../ExplainView.jsx';

// 课件内嵌「练一练」：点按钮后用同一知识点【随机出一道新题】（数值随机，尽量不同于课件当前演示值）。
// 完全复用后端 generate/judge/explain —— 题目（含 visual 配图）由后端生成，答案由 topic.solve 计算，前端不碰答案。
const DIFFS = ['easy', 'medium', 'hard'];
const sameParams = (a, b) => a && b && JSON.stringify(a) === JSON.stringify(b);

export default function InlinePractice({ topicId, topicTitle, avoidParams = null }) {
  // 在挂载时把"课件当前参数"快照下来，确保出的第一题和演示值不同；之后拖动课件不影响已出的题
  const [avoidKey] = useState(() => (avoidParams ? JSON.stringify(avoidParams) : ''));

  const [q, setQ] = useState(null);
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [explain, setExplain] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const fetchNew = useCallback(async () => {
    setBusy(true);
    setErr('');
    setResult(null);
    setExplain(null);
    setSelected(null);
    setInput('');
    try {
      let question = null;
      // 随机难度 + 重试，尽量出一道和课件当前演示值不同的新题
      for (let i = 0; i < 5; i++) {
        const diff = DIFFS[Math.floor(Math.random() * DIFFS.length)];
        const { question: got } = await api.question(topicId, diff);
        question = got;
        if (!avoidKey || JSON.stringify(got.params) !== avoidKey) break;
      }
      setQ(question);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }, [topicId, avoidKey]);

  useEffect(() => {
    fetchNew();
  }, [fetchNew]);

  async function submit() {
    const userAnswer = q.type === 'choice' ? selected : input.trim();
    if (userAnswer === null || userAnswer === '' || userAnswer === undefined) return;
    setBusy(true);
    setErr('');
    try {
      const r = await api.judge(q.topicId, q.params, userAnswer);
      setResult(r);
      recordAnswer({ topicId: q.topicId, topicTitle: q.topicTitle || topicTitle, correct: r.correct });
      if (!r.correct) {
        const correctText =
          r.correctValue !== undefined
            ? q.options?.find((o) => o.value === r.correctValue)?.label ?? r.correctValue
            : r.correctAnswer;
        addWrong({
          topicId: q.topicId,
          topicTitle: q.topicTitle || topicTitle,
          category: q.category,
          difficulty: q.difficulty,
          stem: q.stem,
          type: q.type,
          options: q.options,
          visual: q.visual,
          params: q.params,
          yourAnswer:
            q.type === 'choice' ? q.options.find((o) => o.value === userAnswer)?.label : userAnswer,
          correctAnswer: String(correctText),
        });
      } else {
        resolveWrong(q.topicId, q.params);
      }
      const ex = await api.explain(q.topicId, q.params, q.stem);
      setExplain(ex);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const correctText =
    result &&
    (result.correctValue !== undefined
      ? q?.options?.find((o) => o.value === result.correctValue)?.label ?? result.correctValue
      : result.correctAnswer);

  return (
    <div className="practice">
      <div className="practice-head">
        <span className="badge amber">练一练</span>
        <span className="muted" style={{ fontSize: 13 }}>随机出的新题，数值和上面的演示不一样</span>
      </div>

      {busy && !q && (
        <div className="row mt12"><span className="spinner" /> <span className="muted">正在出题…</span></div>
      )}
      {err && <div className="verdict no mt12"><span className="vico">⚠️</span><span>{err}</span></div>}

      {q && (
        <>
          <div className="practice-stem">{q.stem}</div>

          {q.visual && <GeometrySVG visual={q.visual} />}

          {q.type === 'choice' ? (
            <div className="options">
              {q.options.map((o) => {
                let cls = 'option';
                if (result) {
                  if (o.value === result.correctValue) cls += ' right';
                  else if (o.value === selected) cls += ' wrong';
                } else if (o.value === selected) cls += ' selected';
                return (
                  <button key={o.key} className={cls} disabled={!!result} onClick={() => setSelected(o.value)}>
                    <span className="okey">{o.key}</span>
                    <span>{o.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              className="answer-input mt12"
              placeholder="输入你的答案（如 1/2、78.5）"
              value={input}
              disabled={!!result}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !result && submit()}
            />
          )}

          {!result && (
            <button
              className="btn btn-primary btn-block mt16"
              disabled={busy || (q.type === 'choice' ? selected === null : input.trim() === '')}
              onClick={submit}
            >
              {busy ? '判题中…' : '提交答案'}
            </button>
          )}

          {result && (
            <div className={'verdict mt16 ' + (result.correct ? 'ok' : 'no')}>
              <span className="vico">{result.correct ? '🎉' : '💪'}</span>
              <span>{result.correct ? '答对了，很棒！' : `答错了。正确答案是 ${correctText}`}</span>
            </div>
          )}

          {busy && result && !explain && (
            <div className="row mt16"><span className="spinner" /> <span className="muted">老师正在准备讲解…</span></div>
          )}
          {explain && <ExplainView data={explain} />}

          <button className="btn btn-ghost btn-block mt16" disabled={busy} onClick={fetchNew}>
            换一道随机题 →
          </button>
        </>
      )}
    </div>
  );
}
