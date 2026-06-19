import { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api.js';
import { addWrong, recordAnswer, resolveWrong, weakestTopic } from '../lib/store.js';
import GeometrySVG from '../components/GeometrySVG.jsx';
import ExplainView from '../components/ExplainView.jsx';

const DIFFS = [
  { v: 'easy', label: '简单' },
  { v: 'medium', label: '中等' },
  { v: 'hard', label: '困难' },
];

export default function Quiz() {
  const { topicId } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const retry = loc.state?.retryQuestion; // 从错题本「重做这道题」带过来的原题

  const [difficulty, setDifficulty] = useState('medium');
  const [q, setQ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [selected, setSelected] = useState(null); // 选择题选中的 value
  const [input, setInput] = useState(''); // 填空题输入
  const [result, setResult] = useState(null); // 判题结果
  const [explain, setExplain] = useState(null);
  const [explaining, setExplaining] = useState(false);

  const load = useCallback(
    async (diff) => {
      setLoading(true);
      setErr('');
      setResult(null);
      setExplain(null);
      setSelected(null);
      setInput('');
      try {
        const { question } = await api.question(topicId, diff);
        setQ(question);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    },
    [topicId]
  );

  useEffect(() => {
    // 错题本「重做这道题」：直接用原题（同参数），不重新出题
    if (retry && retry.topicId === topicId) {
      setQ(retry);
      setDifficulty(retry.difficulty || 'medium');
      setLoading(false);
      setErr('');
      setResult(null);
      setExplain(null);
      setSelected(null);
      setInput('');
    } else {
      load(difficulty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId]);

  function changeDiff(v) {
    setDifficulty(v);
    load(v);
  }

  async function submit() {
    const userAnswer = q.type === 'choice' ? selected : input.trim();
    if (userAnswer === null || userAnswer === '' || userAnswer === undefined) return;
    try {
      const r = await api.judge(q.topicId, q.params, userAnswer);
      setResult(r);
      // 记录进度
      recordAnswer({ topicId: q.topicId, topicTitle: q.topicTitle, correct: r.correct });
      if (!r.correct) {
        // 答错存入错题本（保存足够信息以便"重做这道题"原样复现）
        const correctText =
          r.correctValue !== undefined
            ? q.options?.find((o) => o.value === r.correctValue)?.label ?? r.correctValue
            : r.correctAnswer;
        addWrong({
          topicId: q.topicId,
          topicTitle: q.topicTitle,
          category: q.category,
          difficulty: q.difficulty,
          stem: q.stem,
          type: q.type,
          options: q.options,
          visual: q.visual,
          params: q.params,
          yourAnswer: q.type === 'choice' ? q.options.find((o) => o.value === userAnswer)?.label : userAnswer,
          correctAnswer: q.type === 'choice' ? correctText : String(correctText),
        });
      } else {
        // 答对了：若这道题在错题本里，自动移除（做对即清除）
        resolveWrong(q.topicId, q.params);
      }
      // 自动拉取讲解
      setExplaining(true);
      const ex = await api.explain(q.topicId, q.params, q.stem);
      setExplain(ex);
    } catch (e) {
      setErr(e.message);
    } finally {
      setExplaining(false);
    }
  }

  const weak = weakestTopic();

  if (err)
    return (
      <div>
        <Link to="/grades" className="back">← 返回</Link>
        <div className="empty">出错了：{err}<br /><span className="muted">请确认后端服务在运行。</span></div>
      </div>
    );

  return (
    <div>
      <Link to="/grades" className="back">← 换知识点</Link>

      <div className="row between wrap mt12">
        <h2>{q?.topicTitle || '加载中…'}</h2>
        <div className="seg">
          {DIFFS.map((d) => (
            <button key={d.v} className={difficulty === d.v ? 'on' : ''} onClick={() => changeDiff(d.v)}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="card mt16 row">
          <span className="spinner" /> <span className="muted">正在出题…</span>
        </div>
      )}

      {!loading && q && (
        <div className="card mt16">
          <div className="row wrap" style={{ gap: 8, marginBottom: 12 }}>
            <span className="badge">{q.category}</span>
            <span className="badge grey">{DIFFS.find((d) => d.v === q.difficulty)?.label || '练习'}</span>
          </div>

          <div className="stem">{q.stem}</div>

          {q.visual && <GeometrySVG visual={q.visual} />}

          {/* 选择题 */}
          {q.type === 'choice' && (
            <div className="options">
              {q.options.map((o) => {
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
          )}

          {/* 填空 / 数值题 */}
          {q.type !== 'choice' && (
            <input
              className="answer-input mt16"
              placeholder={q.type === 'text' ? '输入答案（如 1/3）' : '输入你的答案'}
              value={input}
              disabled={!!result}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !result && submit()}
            />
          )}

          {/* 提交按钮 */}
          {!result && (
            <button
              className="btn btn-primary btn-block mt16"
              disabled={q.type === 'choice' ? selected === null : input.trim() === ''}
              onClick={submit}
            >
              提交答案
            </button>
          )}

          {/* 判定结果 */}
          {result && (
            <div className={'verdict mt16 ' + (result.correct ? 'ok' : 'no')}>
              <span className="vico">{result.correct ? '🎉' : '💪'}</span>
              <span>
                {result.correct
                  ? '答对了，很棒！'
                  : `答错了。正确答案是 ${
                      result.correctValue !== undefined
                        ? q.options?.find((o) => o.value === result.correctValue)?.label ?? result.correctValue
                        : result.correctAnswer
                    }`}
              </span>
            </div>
          )}

          {/* 讲解 */}
          {explaining && (
            <div className="row mt16">
              <span className="spinner" /> <span className="muted">老师正在准备讲解…</span>
            </div>
          )}
          {explain && <ExplainView data={explain} />}

          {/* 下一步操作 */}
          {result && (
            <div className="row wrap mt24" style={{ gap: 10 }}>
              <button className="btn btn-primary" onClick={() => load(difficulty)}>
                下一题 →
              </button>
              {weak && weak.id !== topicId && (
                <button className="btn btn-amber" onClick={() => nav(`/quiz/${weak.id}`)}>
                  练薄弱点「{weak.title}」
                </button>
              )}
              <Link to="/progress" className="btn btn-ghost">看学习进度</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
