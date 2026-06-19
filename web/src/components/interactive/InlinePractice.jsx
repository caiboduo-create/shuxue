import { useState } from 'react';
import { api } from '../../lib/api.js';
import { addWrong, recordAnswer } from '../../lib/store.js';
import ExplainView from '../ExplainView.jsx';

// 课件内嵌「练一练」：把学生在演示里拖出的当前参数直接变成一道题。
// 复用后端 /judge 与 /explain —— 答案仍由后端 topic.solve(params) 计算，前端不碰答案。
// props: { topicId, topicTitle, params, stem, type:'numeric'|'choice', options?, hint?, onNew? }
export default function InlinePractice({
  topicId,
  topicTitle,
  params,
  stem,
  type = 'numeric',
  options = [],
  hint,
  onNew,
}) {
  const [input, setInput] = useState('');
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [explain, setExplain] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  async function submit() {
    const userAnswer = type === 'choice' ? selected : input.trim();
    if (userAnswer === null || userAnswer === '' || userAnswer === undefined) return;
    setBusy(true);
    setErr('');
    try {
      const r = await api.judge(topicId, params, userAnswer);
      setResult(r);
      recordAnswer({ topicId, topicTitle, correct: r.correct });
      if (!r.correct) {
        const correctText =
          r.correctValue !== undefined
            ? options.find((o) => o.value === r.correctValue)?.label ?? r.correctValue
            : r.correctAnswer;
        addWrong({
          topicId,
          topicTitle,
          difficulty: 'demo',
          stem,
          yourAnswer:
            type === 'choice' ? options.find((o) => o.value === userAnswer)?.label : userAnswer,
          correctAnswer: type === 'choice' ? String(correctText) : String(correctText),
        });
      }
      const ex = await api.explain(topicId, params, stem);
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
      ? options.find((o) => o.value === result.correctValue)?.label ?? result.correctValue
      : result.correctAnswer);

  return (
    <div className="practice">
      <div className="practice-head">
        <span className="badge amber">练一练</span>
        <span className="muted" style={{ fontSize: 13 }}>用你刚才设定的数值出的题</span>
      </div>

      <div className="practice-stem">{stem}</div>

      {type === 'choice' ? (
        <div className="options">
          {options.map((o) => {
            let cls = 'option';
            if (result) {
              if (o.value === result.correctValue) cls += ' right';
              else if (o.value === selected) cls += ' wrong';
            } else if (o.value === selected) cls += ' selected';
            return (
              <button
                key={o.key}
                className={cls}
                disabled={!!result}
                onClick={() => setSelected(o.value)}
              >
                <span className="okey">{o.key}</span>
                <span>{o.label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <input
          className="answer-input mt12"
          placeholder={hint || '输入你的答案'}
          value={input}
          disabled={!!result}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !result && submit()}
        />
      )}
      {hint && type !== 'choice' && <div className="muted mt8" style={{ fontSize: 13 }}>{hint}</div>}

      {err && <div className="verdict no mt12"><span className="vico">⚠️</span><span>{err}</span></div>}

      {!result && (
        <button
          className="btn btn-primary btn-block mt16"
          disabled={busy || (type === 'choice' ? selected === null : input.trim() === '')}
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

      {busy && !explain && (
        <div className="row mt16"><span className="spinner" /> <span className="muted">老师正在准备讲解…</span></div>
      )}
      {explain && <ExplainView data={explain} />}

      {result && onNew && (
        <button className="btn btn-ghost btn-block mt16" onClick={onNew}>
          换一组数值再练 →
        </button>
      )}
    </div>
  );
}
