import { useRef, useState, useCallback } from 'react';
import InlinePractice from './InlinePractice.jsx';
import { useSvgDrag, clamp, round2 } from './svgutil.js';

// 点到点距离互动演示：拖动 A、B 两点，实时显示坐标差与距离（勾股定理）。
const OX = 28;
const OY = 208;
const CELL = 25;
const NX = 10;
const NY = 7;
const gx2px = (gx) => OX + gx * CELL;
const gy2py = (gy) => OY - gy * CELL;

export default function DistanceDemo() {
  const svgRef = useRef(null);
  const [a, setA] = useState({ x: 2, y: 1 });
  const [b, setB] = useState({ x: 6, y: 4 });
  const [practice, setPractice] = useState(null);

  const snap = (pt) => ({
    x: clamp(Math.round((pt.x - OX) / CELL), 0, NX),
    y: clamp(Math.round((OY - pt.y) / CELL), 0, NY),
  });
  const onDragA = useCallback((pt) => setA(snap(pt)), []);
  const onDragB = useCallback((pt) => setB(snap(pt)), []);
  const startA = useSvgDrag(svgRef, onDragA);
  const startB = useSvgDrag(svgRef, onDragB);

  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const sq = dx * dx + dy * dy;
  const dist = Math.sqrt(sq);
  const isInt = Math.abs(dist - Math.round(dist)) < 1e-9;

  const grid = [];
  for (let i = 0; i <= NX; i++) grid.push(<line key={`vx${i}`} x1={gx2px(i)} y1={gy2py(0)} x2={gx2px(i)} y2={gy2py(NY)} stroke="#e6edf7" strokeWidth="1" />);
  for (let j = 0; j <= NY; j++) grid.push(<line key={`hy${j}`} x1={gx2px(0)} y1={gy2py(j)} x2={gx2px(NX)} y2={gy2py(j)} stroke="#e6edf7" strokeWidth="1" />);

  function makeQuestion() {
    setPractice({
      params: { ax: a.x, ay: a.y, bx: b.x, by: b.y },
      stem: `在平面直角坐标系中，点 A(${a.x}, ${a.y}) 和点 B(${b.x}, ${b.y}) 之间的距离是多少？`,
    });
  }

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <svg ref={svgRef} viewBox="0 0 300 235" width="100%" style={{ maxWidth: 400, touchAction: 'none' }}>
            {grid}
            {/* 坐标轴 */}
            <line x1={gx2px(0)} y1={gy2py(0)} x2={gx2px(NX)} y2={gy2py(0)} stroke="#1e293b" strokeWidth="1.5" />
            <line x1={gx2px(0)} y1={gy2py(0)} x2={gx2px(0)} y2={gy2py(NY)} stroke="#1e293b" strokeWidth="1.5" />
            {/* 直角边（坐标差） */}
            <line x1={gx2px(a.x)} y1={gy2py(a.y)} x2={gx2px(b.x)} y2={gy2py(a.y)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 4" />
            <line x1={gx2px(b.x)} y1={gy2py(a.y)} x2={gx2px(b.x)} y2={gy2py(b.y)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="5 4" />
            {dx !== 0 && (
              <text x={(gx2px(a.x) + gx2px(b.x)) / 2} y={gy2py(a.y) + 16} textAnchor="middle" fill="#b45309" fontSize="12" fontWeight="700">{Math.abs(dx)}</text>
            )}
            {dy !== 0 && (
              <text x={gx2px(b.x) + 8} y={(gy2py(a.y) + gy2py(b.y)) / 2} fill="#b45309" fontSize="12" fontWeight="700">{Math.abs(dy)}</text>
            )}
            {/* AB 连线（斜边） */}
            <line x1={gx2px(a.x)} y1={gy2py(a.y)} x2={gx2px(b.x)} y2={gy2py(b.y)} stroke="#2563eb" strokeWidth="3" />
            {/* 两点 */}
            <circle cx={gx2px(a.x)} cy={gy2py(a.y)} r="9" className="handle" onPointerDown={startA} />
            <circle cx={gx2px(b.x)} cy={gy2py(b.y)} r="9" className="handle" onPointerDown={startB} />
            <text x={gx2px(a.x) - 9} y={gy2py(a.y) + 18} textAnchor="end" fill="#1e40af" fontSize="13" fontWeight="700">A({a.x},{a.y})</text>
            <text x={gx2px(b.x) + 10} y={gy2py(b.y) - 9} fill="#1e40af" fontSize="13" fontWeight="700">B({b.x},{b.y})</text>
          </svg>
          <div className="stage-hint">拖动 A、B 两点，看距离怎么变</div>
        </div>

        <div className="demo-side">
          <div className="formula">
            <div className="formula-title">两点间距离</div>
            <div className="formula-main">d = √(Δx² + Δy²)</div>
            <div className="formula-calc">
              横坐标差 Δx = {b.x} − {a.x} = {dx}<br />
              纵坐标差 Δy = {b.y} − {a.y} = {dy}<br />
              d = √({dx}² + {dy}²) = √{sq}<br />
              = <b>{isInt ? Math.round(dist) : round2(dist) + '…'}</b>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          把两点的横坐标差和纵坐标差当作一个直角三角形的两条直角边（图中橙色虚线），
          那么 A、B 之间的距离就是这个三角形的<b>斜边</b>。用勾股定理：两条直角边各自平方、相加，再开平方，就是距离。
          {isInt ? '' : '（当前 √' + sq + ' 不是整数，结果是个无理数，所以写成根号或近似小数。）'}
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" disabled={!isInt || sq === 0} onClick={makeQuestion}>
          {sq === 0 ? '把 A、B 拖开一点' : isInt ? '用当前两点出一道练习题 →' : '把两点拖到距离正好是整数时再出题（如横竖对齐，或 3-4-5）'}
        </button>
      ) : (
        <InlinePractice
          topicId="distance-points"
          topicTitle="平面直角坐标系中两点间的距离"
          params={practice.params}
          stem={practice.stem}
          type="numeric"
          hint="距离正好是整数，直接填数字即可"
          onNew={() => setPractice(null)}
        />
      )}
    </div>
  );
}
