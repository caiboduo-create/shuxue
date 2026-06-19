// 把讲解数据渲染成"老师批注"风格：分步骤、为什么、常见错误、选项解析、思路总结
export default function ExplainView({ data }) {
  if (!data) return null;
  return (
    <div className="explain">
      <div className="row between">
        <h3>📖 讲解</h3>
        <span className={'badge ' + (data.source === 'ai' ? '' : 'grey')}>
          {data.source === 'ai' ? 'AI 老师讲解' : '本地讲解'}
        </span>
      </div>

      {data.steps?.map((s, i) => (
        <div className="ex-step" key={i}>
          <div className="es-title">{s.title || `第 ${i + 1} 步`}</div>
          <div className="es-detail">{s.detail}</div>
        </div>
      ))}

      {data.whyItWorks && (
        <div className="ex-block">
          <h4>💡 为什么这样做</h4>
          <div style={{ lineHeight: 1.7 }}>{data.whyItWorks}</div>
        </div>
      )}

      {data.optionAnalysis?.length > 0 && (
        <div className="ex-block">
          <h4>🔍 选项解析</h4>
          <div className="opt-analysis">
            {data.optionAnalysis.map((o, i) => (
              <div className={'oa ' + (o.correct ? 'ok' : 'no')} key={i}>
                <span className="mark">{o.correct ? '✓' : '✗'}</span>
                <span>
                  <b>{o.label}</b>：{o.reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.commonMistakes?.length > 0 && (
        <div className="ex-block">
          <h4>⚠️ 容易踩的坑</h4>
          <ul>
            {data.commonMistakes.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
      )}

      {data.summary && <div className="ex-summary">🎯 {data.summary}</div>}
    </div>
  );
}
