import { useRef, useState, useCallback } from 'react';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';
import { useSvgDrag, clamp } from './svgutil.js';

// 对称轴互动演示：拖动点 P，实时显示它关于对称轴的对称点 P'，
// 并用虚线说明「两点到对称轴的距离相等」。
const OX = 26;
const OY = 205;
const CELL = 26;
const NX = 12;
const NY = 7;

const gx2px = (gx) => OX + gx * CELL;
const gy2py = (gy) => OY - gy * CELL;

export default function SymmetryDemo() {
  const svgRef = useRef(null);
  const [axisX, setAxisX] = useState(6);
  const [p, setP] = useState({ x: 3, y: 4 });
  const [practice, setPractice] = useState(false);

  // P' 关于竖直对称轴对称：横坐标镜像，纵坐标不变
  const mx = 2 * axisX - p.x;

  const onDrag = useCallback(
    (pt) => {
      setP(() => {
        const gy = clamp(Math.round((OY - pt.y) / CELL), 0, NY);
        return { x: clamp(Math.round((pt.x - OX) / CELL), 0, NX), y: gy };
      });
    },
    []
  );
  const startP = useSvgDrag(svgRef, onDrag);

  const dist = Math.abs(p.x - axisX);
  // 保证对称点不跑出画面：限制 P 的横坐标范围
  const mxClamped = clamp(mx, 0, NX);

  const grid = [];
  for (let i = 0; i <= NX; i++) grid.push(<line key={`vx${i}`} x1={gx2px(i)} y1={gy2py(0)} x2={gx2px(i)} y2={gy2py(NY)} stroke="#e6edf7" strokeWidth="1" />);
  for (let j = 0; j <= NY; j++) grid.push(<line key={`hy${j}`} x1={gx2px(0)} y1={gy2py(j)} x2={gx2px(NX)} y2={gy2py(j)} stroke="#e6edf7" strokeWidth="1" />);

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <svg ref={svgRef} viewBox="0 0 350 240" width="100%" style={{ maxWidth: 420, touchAction: 'none' }}>
            {grid}
            {/* 对称轴 */}
            <line x1={gx2px(axisX)} y1={gy2py(0)} x2={gx2px(axisX)} y2={gy2py(NY)} stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="7 5" />
            <text x={gx2px(axisX)} y={gy2py(NY) - 6} textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="700">对称轴</text>
            {/* 连接虚线 P — 垂足 — P' */}
            <line x1={gx2px(p.x)} y1={gy2py(p.y)} x2={gx2px(mxClamped)} y2={gy2py(p.y)} stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="5 4" />
            {/* 两段相等距离标注 */}
            <text x={(gx2px(p.x) + gx2px(axisX)) / 2} y={gy2py(p.y) - 8} textAnchor="middle" fill="#b45309" fontSize="12" fontWeight="700">{dist}</text>
            <text x={(gx2px(axisX) + gx2px(mxClamped)) / 2} y={gy2py(p.y) - 8} textAnchor="middle" fill="#b45309" fontSize="12" fontWeight="700">{dist}</text>
            {/* 垂足 */}
            <circle cx={gx2px(axisX)} cy={gy2py(p.y)} r="3" fill="#7c3aed" />
            {/* 对称点 P' */}
            <circle cx={gx2px(mxClamped)} cy={gy2py(p.y)} r="7" fill="#f59e0b" />
            <text x={gx2px(mxClamped) + 9} y={gy2py(p.y) - 9} fill="#b45309" fontSize="13" fontWeight="700">P'({mx},{p.y})</text>
            {/* 原始点 P（可拖动） */}
            <circle cx={gx2px(p.x)} cy={gy2py(p.y)} r="9" className="handle" onPointerDown={startP} />
            <text x={gx2px(p.x) - 9} y={gy2py(p.y) - 9} textAnchor="end" fill="#1e40af" fontSize="13" fontWeight="700">P({p.x},{p.y})</text>
          </svg>
          <div className="stage-hint">拖动蓝点 P，看它的对称点 P' 怎么跟着动</div>
        </div>

        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="对称轴位置" value={axisX} min={1} max={11} unit=" 列" onChange={setAxisX} />
          </div>
          <div className="formula">
            <div className="formula-title">对称点关系</div>
            <div className="formula-calc">
              点 P 到对称轴：<b>{dist}</b> 格<br />
              点 P' 到对称轴：<b>{dist}</b> 格<br />
              <span className="muted">两段距离永远相等</span>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          轴对称就像照镜子：对称轴是那面镜子。点 P 和它在镜子里的像 P' 一定满足两条规则——
          <b>连线和对称轴垂直</b>，而且 <b>两个点到对称轴的距离一样远</b>。
          所以你把 P 往左推一格，P' 就往右弹一格，始终和镜子保持同样的距离。
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道对称轴的题练一练 →
        </button>
      ) : (
        <InlinePractice topicId="symmetry-axis" topicTitle="轴对称图形的对称轴" />
      )}
    </div>
  );
}
