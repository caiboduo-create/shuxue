import { useState } from 'react';
import GeometrySVG from '../GeometrySVG.jsx';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';

// 分数的比较与加减互动演示：改分子/分母，方格条形图实时变化。
// 复用 GeometrySVG 的 fraction 渲染，出题复用 fraction-visual 知识点。
// 注意：加减法两个分数同分母（与后端 solve 一致，分母取第一个分数的 d）。
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}
function simp(n, d) {
  if (n === 0) return '0';
  const g = gcd(n, d);
  const nn = n / g;
  const dd = d / g;
  return dd === 1 ? `${nn}` : `${nn}/${dd}`;
}

const COMPARE_OPTIONS = [
  { key: 'A', label: '>（大于）', value: '>' },
  { key: 'B', label: '<（小于）', value: '<' },
  { key: 'C', label: '=（等于）', value: '=' },
];

export default function FractionDemo() {
  const [mode, setMode] = useState('compare'); // compare | add | sub
  const [sameDenominator, setSameDenominator] = useState(true);
  const [n1, setN1] = useState(1);
  const [d1, setD1] = useState(2);
  const [n2, setN2] = useState(2);
  const [d2, setD2] = useState(3);
  const [practice, setPractice] = useState(null);

  const effD2 = mode === 'compare' || !sameDenominator ? d2 : d1;
  const lcm = (d1 * effD2) / gcd(d1, effD2);
  const nn1 = n1 * (lcm / d1);
  const nn2 = n2 * (lcm / effD2);

  // 带约束的 setter（分子必须小于分母）
  const setDenom1 = (v) => { setD1(v); if (n1 > v - 1) setN1(v - 1); };
  const setDenom2 = (v) => { setD2(v); if (n2 > v - 1) setN2(v - 1); };
  const setNum1 = (v) => setN1(clamp(v, 1, d1 - 1));
  const setNum2 = (v) => setN2(clamp(v, 1, effD2 - 1));

  function changeMode(m) {
    setMode(m);
    setPractice(null);
    if (m !== 'compare' && n2 > d1 - 1) setN2(d1 - 1); // 切到加减时夹住第二个分子
  }

  const a = { n: n1, d: d1 };
  const b = { n: n2, d: effD2 };
  const visual =
    mode === 'compare'
      ? { kind: 'fraction', layout: 'compare', a, b }
      : { kind: 'fraction', layout: 'op', op: mode === 'add' ? '+' : '-', a, b };

  // 实时结果
  let resultLine;
  let canAsk = true;
  let askHint = '';
  if (mode === 'compare') {
    const left = n1 * effD2;
    const right = n2 * d1;
    const sym = left > right ? '>' : left < right ? '<' : '=';
    resultLine = (
      <>
        {n1}/{d1} <b>{sym}</b> {n2}/{effD2}
      </>
    );
  } else if (mode === 'add') {
    const sum = nn1 + nn2;
    resultLine = (
      <>
        {n1}/{d1} + {n2}/{effD2} = {nn1}/{lcm} + {nn2}/{lcm} = {sum}/{lcm} = <b>{simp(sum, lcm)}</b>
      </>
    );
  } else {
    const diff = nn1 - nn2;
    canAsk = diff > 0;
    askHint = canAsk ? '' : '减法要让前一个分数更大';
    resultLine = canAsk ? (
      <>
        {n1}/{d1} − {n2}/{effD2} = {nn1}/{lcm} − {nn2}/{lcm} = {diff}/{lcm} = <b>{simp(diff, lcm)}</b>
      </>
    ) : (
      <span className="muted">{askHint}</span>
    );
  }

  return (
    <div className="demo">
      <div className="seg mt8" style={{ display: 'flex' }}>
        <button className={mode === 'compare' ? 'on' : ''} onClick={() => changeMode('compare')}>比较大小</button>
        <button className={mode === 'add' ? 'on' : ''} onClick={() => changeMode('add')}>加法</button>
        <button className={mode === 'sub' ? 'on' : ''} onClick={() => changeMode('sub')}>减法</button>
      </div>

      <div className="demo-grid mt16">
        <div className="demo-stage">
          <GeometrySVG visual={visual} />
          <div className="stage-hint">蓝色格子表示分数的大小（取了几份）</div>
        </div>
        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="分数1 · 分子" value={n1} min={1} max={d1 - 1} onChange={setNum1} />
            <Slider label="分数1 · 分母" value={d1} min={2} max={10} onChange={setDenom1} />
            <Slider label="分数2 · 分子" value={n2} min={1} max={effD2 - 1} onChange={setNum2} />
            {mode !== 'compare' && (
              <div className="seg" style={{ display: 'flex' }}>
                <button className={sameDenominator ? 'on' : ''} onClick={() => setSameDenominator(true)}>同分母</button>
                <button className={!sameDenominator ? 'on' : ''} onClick={() => setSameDenominator(false)}>异分母</button>
              </div>
            )}
            {(mode === 'compare' || !sameDenominator) && (
              <Slider label="分数2 · 分母" value={d2} min={2} max={10} onChange={setDenom2} />
            )}
            {mode !== 'compare' && sameDenominator && (
              <div className="muted" style={{ fontSize: 13 }}>加减法两个分数同分母，分母都是 {d1}。</div>
            )}
            {mode !== 'compare' && !sameDenominator && (
              <div className="muted" style={{ fontSize: 13 }}>
                异分母要先通分：公分母是 {lcm}。
              </div>
            )}
          </div>
          <div className="formula">
            <div className="formula-title">{mode === 'compare' ? '谁大谁小' : '计算结果'}</div>
            <div className="formula-calc">{resultLine}</div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          分数表示把整体平均分成几份、取了其中几份。<b>分母</b>是分成的份数，分母越大每份越小；
          <b>分子</b>是取的份数。比较大小时，分母相同就比分子；分母不同要先通分。
          同分母加减时，<b>分母不变，分子相加减</b>，算完别忘了约成最简分数。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道分数题练一练 →
        </button>
      ) : (
        <InlinePractice
          topicId="fraction-visual"
          topicTitle="分数的比较与加减"
          avoidParams={mode === 'compare' ? { form: 'compare', a, b } : { form: mode, a, b }}
        />
      )}
    </div>
  );
}
