import { useRef, useState, useCallback } from 'react';
import Slider from './Slider.jsx';
import InlinePractice from './InlinePractice.jsx';
import { useSvgDrag, clamp, round2 } from './svgutil.js';

// 扇形面积互动演示：拖半径 r、拖圆心角 θ，扇形实时变化，公式与结果实时更新。
const CX = 160;
const CY = 150;
const SCALE = 8; // 每单位半径对应的像素（半径范围增大后调小，保证大圆不超框）

export default function SectorDemo() {
  const svgRef = useRef(null);
  const [r, setR] = useState(6);
  const [theta, setTheta] = useState(120);
  const [practice, setPractice] = useState(null);

  const pr = r * SCALE;
  const rad = (theta * Math.PI) / 180;
  // 扇形起边在 +x 方向，逆时针扫过 θ（屏幕 y 向下，所以纵坐标取减）
  const sx = CX + pr;
  const sy = CY;
  const ex = CX + pr * Math.cos(rad);
  const ey = CY - pr * Math.sin(rad);
  const large = theta > 180 ? 1 : 0;
  const sectorPath = `M ${CX} ${CY} L ${sx} ${sy} A ${pr} ${pr} 0 ${large} 0 ${ex} ${ey} Z`;

  // 拖半径手柄（沿起边水平拖动）
  const onDragR = useCallback((p) => {
    setR(clamp(Math.round((p.x - CX) / SCALE), 1, 15));
  }, []);
  // 拖角度手柄（绕圆心旋转）
  const onDragTheta = useCallback((p) => {
    let a = (Math.atan2(CY - p.y, p.x - CX) * 180) / Math.PI;
    if (a < 0) a += 360;
    setTheta(clamp(Math.round(a / 5) * 5, 0, 360));
  }, []);
  const startR = useSvgDrag(svgRef, onDragR);
  const startTheta = useSvgDrag(svgRef, onDragTheta);

  const coef = round2((theta / 360) * r * r); // 面积里 π 前面的系数
  const approx = round2(coef * 3.14);

  return (
    <div className="demo">
      <div className="demo-grid">
        <div className="demo-stage">
          <svg ref={svgRef} viewBox="0 0 320 280" width="100%" style={{ maxWidth: 360, touchAction: 'none' }}>
            {/* 整个圆（淡） */}
            <circle cx={CX} cy={CY} r={pr} fill="#f1f5fd" stroke="#cdd9ec" strokeWidth="1.5" />
            {/* 扇形 */}
            <path d={sectorPath} fill="#dbe7ff" stroke="#2563eb" strokeWidth="2.5" />
            {/* 半径标注线 */}
            <line x1={CX} y1={CY} x2={sx} y2={sy} stroke="#2563eb" strokeWidth="2.5" />
            {/* 角度弧 */}
            <path
              d={`M ${CX + 26} ${CY} A 26 26 0 ${large} 0 ${CX + 26 * Math.cos(rad)} ${CY - 26 * Math.sin(rad)}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
            />
            <text x={CX + 34} y={CY - 14} fill="#b45309" fontSize="14" fontWeight="700">{theta}°</text>
            {/* r 文字 */}
            <text x={CX + pr / 2} y={CY - 8} textAnchor="middle" fill="#1e40af" fontSize="13" fontWeight="700">r = {r}</text>
            {/* 圆心 */}
            <circle cx={CX} cy={CY} r="4" fill="#1e293b" />
            {/* 半径拖动手柄 */}
            <circle cx={sx} cy={sy} r="9" className="handle" onPointerDown={startR} />
            {/* 角度拖动手柄 */}
            <circle cx={ex} cy={ey} r="9" className="handle amber" onPointerDown={startTheta} />
          </svg>
          <div className="stage-hint">圆点可拖动：右侧蓝点拖半径，橙点绕圈拖角度</div>
        </div>

        <div className="demo-side">
          <div className="demo-controls">
            <Slider label="半径 r" value={r} min={1} max={15} unit=" cm" onChange={setR} />
            <Slider label="圆心角 θ" value={theta} min={0} max={360} step={5} unit="°" onChange={setTheta} />
          </div>

          <div className="formula">
            <div className="formula-title">扇形面积公式</div>
            <div className="formula-main">S = (θ ÷ 360) × π × r²</div>
            <div className="formula-calc">
              = ({theta} ÷ 360) × π × {r}²<br />
              = <b>{coef}π</b> 平方厘米<br />
              <span className="muted">π 取 3.14 时 ≈ {approx} 平方厘米</span>
            </div>
          </div>
        </div>
      </div>

      <div className="teacher">
        <div className="teacher-ico">👩‍🏫</div>
        <div>
          扇形就是从圆里切下来的一块「饼」。圆心角 <b>{theta}°</b> 占整个周角 360° 的{' '}
          <b>{theta}/360</b>，所以这块扇形就是整个圆的 {theta}/360。先算整个圆的面积 πr²，再乘上这个比例，就得到扇形面积。
          {theta >= 360 ? '（θ = 360° 时，扇形正好就是一整个圆。）' : ''}
        </div>
      </div>

      {!practice ? (
        <button className="btn btn-primary btn-block mt16" onClick={() => setPractice(true)}>
          随机出一道扇形面积题练一练 →
        </button>
      ) : (
        <InlinePractice topicId="sector-area" topicTitle="扇形的面积" avoidParams={{ r, theta }} />
      )}
    </div>
  );
}
