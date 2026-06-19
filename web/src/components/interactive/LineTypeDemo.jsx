import { useRef, useState, useCallback } from 'react';
import InlinePractice from './InlinePractice.jsx';
import { useSvgDrag, clamp } from './svgutil.js';

// 线段 / 射线 / 直线互动演示：切换三种线，拖动端点，对照三者差异。
const Y = 80;
const XL = 36;
const XR = 324;
const NAMES = { segment: '线段', ray: '射线', line: '直线' };
const OPTIONS = [
  { key: 'A', label: '线段', value: 'segment' },
  { key: 'B', label: '射线', value: 'ray' },
  { key: 'C', label: '直线', value: 'line' },
];
const FACTS = [
  { row: '端点个数', segment: '2 个', ray: '1 个', line: '0 个' },
  { row: '能否无限延伸', segment: '不能', ray: '能（一端）', line: '能（两端）' },
  { row: '能否量出长度', segment: '能', ray: '不能', line: '不能' },
];

export default function LineTypeDemo() {
  const svgRef = useRef(null);
  const [variant, setVariant] = useState('segment');
  const [xa, setXa] = useState(110);
  const [xb, setXb] = useState(250);
  const [xe, setXe] = useState(140);
  const [practice, setPractice] = useState(null);

  const onDragA = useCallback((p) => setXa(clamp(Math.round(p.x), XL + 6, XR - 6)), []);
  const onDragB = useCallback((p) => setXb(clamp(Math.round(p.x), XL + 6, XR - 6)), []);
  const onDragE = useCallback((p) => setXe(clamp(Math.round(p.x), XL + 6, XR - 6)), []);
  const startA = useSvgDrag(svgRef, onDragA);
  const startB = useSvgDrag(svgRef, onDragB);
  const startE = useSvgDrag(svgRef, onDragE);

  function choose(v) {
    setVariant(v);
    setPractice(null);
  }
  return (
    <div className="demo">
      <div className="seg mt8" style={{ display: 'flex' }}>
        {OPTIONS.map((o) => (
          <button key={o.value} className={variant === o.value ? 'on' : ''} onClick={() => choose(o.value)}>
            {o.label}
          </button>
        ))}
      </div>

      <div className="demo-stage mt16">
        <svg ref={svgRef} viewBox="0 0 360 150" width="100%" style={{ maxWidth: 420, touchAction: 'none' }}>
          <defs>
            <marker id="lt-arrow" markerWidth="12" markerHeight="12" refX="8" refY="4" orient="auto">
              <path d="M0,0 L9,4 L0,8 Z" fill="#2563eb" />
            </marker>
          </defs>

          {variant === 'segment' && (
            <>
              <line x1={xa} y1={Y} x2={xb} y2={Y} stroke="#2563eb" strokeWidth="3.5" />
              <circle cx={xa} cy={Y} r="9" className="handle" onPointerDown={startA} />
              <circle cx={xb} cy={Y} r="9" className="handle" onPointerDown={startB} />
              <text x={(xa + xb) / 2} y={Y - 16} textAnchor="middle" fill="#1e40af" fontSize="13" fontWeight="700">两个端点，长度固定</text>
            </>
          )}

          {variant === 'ray' && (
            <>
              <line x1={xe} y1={Y} x2={XR} y2={Y} stroke="#2563eb" strokeWidth="3.5" markerEnd="url(#lt-arrow)" />
              <circle cx={xe} cy={Y} r="9" className="handle" onPointerDown={startE} />
              <text x={(xe + XR) / 2} y={Y - 16} textAnchor="middle" fill="#1e40af" fontSize="13" fontWeight="700">一个端点，向一端无限延伸</text>
            </>
          )}

          {variant === 'line' && (
            <>
              <line x1={XL} y1={Y} x2={XR} y2={Y} stroke="#2563eb" strokeWidth="3.5" markerStart="url(#lt-arrow)" markerEnd="url(#lt-arrow)" />
              {/* 直线上任取两点：可拖动，但直线永远没有尽头 */}
              <circle cx={xa} cy={Y} r="8" className="handle hollow" onPointerDown={startA} />
              <circle cx={xb} cy={Y} r="8" className="handle hollow" onPointerDown={startB} />
              <text x={180} y={Y - 16} textAnchor="middle" fill="#1e40af" fontSize="13" fontWeight="700">没有端点，向两端无限延伸</text>
            </>
          )}
        </svg>
        <div className="stage-hint">
          {variant === 'line' ? '点是直线上任取的，拖动它直线依然没有尽头' : '拖动圆点试试看'}
        </div>
      </div>

      <table className="cmp-table mt16">
        <thead>
          <tr>
            <th></th>
            {OPTIONS.map((o) => (
              <th key={o.value} className={variant === o.value ? 'on' : ''}>{o.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FACTS.map((f) => (
            <tr key={f.row}>
              <td className="rh">{f.row}</td>
              {OPTIONS.map((o) => (
                <td key={o.value} className={variant === o.value ? 'on' : ''}>{f[o.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="teacher mt16">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          分清三种线，只看两点：<b>有几个端点</b>、<b>能不能无限延伸</b>。
          线段两端都封口（有 2 个端点），所以能量出长度；射线只有 1 个端点，朝一个方向跑到没有尽头；
          直线一个端点也没有，两头都无限延伸。口诀：<b>线段封口、射线一头箭、直线两头箭</b>。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道辨认线型的题 →
        </button>
      ) : (
        <InlinePractice topicId="line-types" topicTitle="线段、射线和直线" avoidParams={{ form: 'identify', variant }} />
      )}
    </div>
  );
}
