// 几何可视化：把后端返回的结构化 visual 规格渲染成 SVG。
// 支持 line（线段/射线/直线）、angle（角）、rect（长方形/正方形，可带单位格）。
// 新增图形类型只需在这里加一个分支。

const C = {
  ink: '#1e293b',
  blue: '#2563eb',
  amber: '#f59e0b',
  faint: '#cdd9ec',
};

function LineFigure({ variant }) {
  // segment 两端封口；ray 左端点+右箭头；line 两端箭头
  const y = 60;
  const x1 = 50;
  const x2 = 350;
  return (
    <svg viewBox="0 0 400 120" width="100%" style={{ maxWidth: 420 }}>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="7" refY="3" orient="auto">
          <path d="M0,0 L8,3 L0,6 Z" fill={C.blue} />
        </marker>
      </defs>
      <line
        x1={variant === 'line' ? x1 + 8 : x1}
        y1={y}
        x2={variant === 'segment' ? x2 : x2 - 8}
        y2={y}
        stroke={C.blue}
        strokeWidth="3"
        markerEnd={variant === 'segment' ? '' : 'url(#arrow)'}
        markerStart={variant === 'line' ? 'url(#arrow)' : ''}
      />
      {/* 端点圆点：线段两个、射线一个、直线没有 */}
      {variant !== 'line' && <circle cx={x1} cy={y} r="5" fill={C.ink} />}
      {variant === 'segment' && <circle cx={x2} cy={y} r="5" fill={C.ink} />}
      <text x="200" y="100" textAnchor="middle" fill="#94a3b8" fontSize="13">
        {variant === 'segment' ? '两端封口 = 线段' : variant === 'ray' ? '一端无限延伸 = 射线' : '两端无限延伸 = 直线'}
      </text>
    </svg>
  );
}

function AngleFigure({ degrees }) {
  const cx = 80;
  const cy = 150;
  const len = 150;
  const rad = (degrees * Math.PI) / 180;
  // 一条边水平向右，另一条边按角度向上旋转
  const x2 = cx + len;
  const y2 = cy;
  const x3 = cx + len * Math.cos(-rad);
  const y3 = cy + len * Math.sin(-rad);
  // 角度弧线
  const arcR = 38;
  const ax = cx + arcR;
  const ay = cy;
  const bx = cx + arcR * Math.cos(-rad);
  const by = cy + arcR * Math.sin(-rad);
  const largeArc = degrees > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 280 200" width="100%" style={{ maxWidth: 320 }}>
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={C.blue} strokeWidth="3" />
      <line x1={cx} y1={cy} x2={x3} y2={y3} stroke={C.blue} strokeWidth="3" />
      <path
        d={`M ${ax} ${ay} A ${arcR} ${arcR} 0 ${largeArc} 0 ${bx} ${by}`}
        fill="none"
        stroke={C.amber}
        strokeWidth="2.5"
      />
      <circle cx={cx} cy={cy} r="4" fill={C.ink} />
      <text x={cx + 52} y={cy - 16} fill="#b45309" fontSize="15" fontWeight="700">
        {degrees}°
      </text>
    </svg>
  );
}

function RectFigure({ w, h, unit, label, grid }) {
  // 自适应缩放，保证图在画布内
  const maxPx = 240;
  const scale = Math.min(maxPx / Math.max(w, h), 30);
  const pw = w * scale;
  const ph = h * scale;
  const pad = 40;
  const vbW = pw + pad * 2;
  const vbH = ph + pad * 2;
  const cells = [];
  if (grid) {
    for (let i = 1; i < w; i++)
      cells.push(<line key={`v${i}`} x1={pad + i * scale} y1={pad} x2={pad + i * scale} y2={pad + ph} stroke={C.faint} strokeWidth="1" />);
    for (let j = 1; j < h; j++)
      cells.push(<line key={`h${j}`} x1={pad} y1={pad + j * scale} x2={pad + pw} y2={pad + j * scale} stroke={C.faint} strokeWidth="1" />);
  }
  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} width="100%" style={{ maxWidth: Math.max(vbW, 200) }}>
      <rect x={pad} y={pad} width={pw} height={ph} fill="#eff5ff" stroke={C.blue} strokeWidth="2.5" rx="2" />
      {cells}
      {/* 顶边标注 */}
      <text x={pad + pw / 2} y={pad - 12} textAnchor="middle" fill={C.ink} fontSize="14" fontWeight="700">
        {w} {unit}
      </text>
      {/* 左边标注 */}
      <text x={pad - 12} y={pad + ph / 2} textAnchor="middle" fill={C.ink} fontSize="14" fontWeight="700" transform={`rotate(-90 ${pad - 12} ${pad + ph / 2})`}>
        {h} {unit}
      </text>
      {label && (
        <text x={pad + pw / 2} y={pad + ph + 24} textAnchor="middle" fill="#94a3b8" fontSize="13">
          {label}
        </text>
      )}
    </svg>
  );
}

// 对称轴图：画出图形本身 + 虚线对称轴
const SHAPE_DEF = {
  square: { poly: '60,40 160,40 160,140 60,140', axes: [[110, 40, 110, 140], [60, 90, 160, 90], [60, 40, 160, 140], [160, 40, 60, 140]], caption: '正方形 · 4 条对称轴' },
  rect: { poly: '40,55 180,55 180,125 40,125', axes: [[110, 55, 110, 125], [40, 90, 180, 90]], caption: '长方形 · 2 条对称轴' },
  eqtri: { poly: '110,35 170,140 50,140', axes: [[110, 35, 110, 140], [170, 140, 80, 87.5], [50, 140, 140, 87.5]], caption: '等边三角形 · 3 条对称轴' },
  isotri: { poly: '110,35 160,145 60,145', axes: [[110, 35, 110, 145]], caption: '等腰三角形 · 1 条对称轴' },
  circle: { circle: [110, 90, 55], axes: [[55, 90, 165, 90], [110, 35, 110, 145], [71, 51, 149, 129]], caption: '圆 · 无数条对称轴' },
  para: { poly: '60,135 150,135 180,55 90,55', axes: [], caption: '平行四边形 · 没有对称轴' },
};

function SymmetryFigure({ shape }) {
  const def = SHAPE_DEF[shape];
  if (!def) return null;
  return (
    <svg viewBox="0 0 220 175" width="100%" style={{ maxWidth: 300 }}>
      {def.circle ? (
        <circle cx={def.circle[0]} cy={def.circle[1]} r={def.circle[2]} fill="#eff5ff" stroke={C.blue} strokeWidth="2.5" />
      ) : (
        <polygon points={def.poly} fill="#eff5ff" stroke={C.blue} strokeWidth="2.5" />
      )}
      {def.axes.map((a, i) => (
        <line key={i} x1={a[0]} y1={a[1]} x2={a[2]} y2={a[3]} stroke={C.amber} strokeWidth="2" strokeDasharray="6 4" />
      ))}
      <text x="110" y="166" textAnchor="middle" fill="#94a3b8" fontSize="13">{def.caption}</text>
    </svg>
  );
}

// 坐标系两点图：第一象限网格 + A、B 两点 + 连线（中等难度加直角边辅助线）
function PointsFigure({ ax, ay, bx, by, legs }) {
  const maxC = Math.max(ax, ay, bx, by, 4);
  const scale = Math.min(220 / maxC, 26);
  const pad = 30;
  const gp = maxC * scale;
  const W = gp + pad * 2;
  const H = gp + pad * 2;
  const px = (x) => pad + x * scale;
  const py = (y) => H - pad - y * scale;
  const grid = [];
  for (let i = 0; i <= maxC; i++) {
    grid.push(<line key={`gx${i}`} x1={px(i)} y1={py(0)} x2={px(i)} y2={py(maxC)} stroke={C.faint} strokeWidth="1" />);
    grid.push(<line key={`gy${i}`} x1={px(0)} y1={py(i)} x2={px(maxC)} y2={py(i)} stroke={C.faint} strokeWidth="1" />);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: Math.max(W, 220) }}>
      {grid}
      {/* 坐标轴 */}
      <line x1={px(0)} y1={py(0)} x2={px(maxC)} y2={py(0)} stroke={C.ink} strokeWidth="1.5" />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(maxC)} stroke={C.ink} strokeWidth="1.5" />
      {/* 直角边辅助线 */}
      {legs && (
        <>
          <line x1={px(ax)} y1={py(ay)} x2={px(bx)} y2={py(ay)} stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" />
          <line x1={px(bx)} y1={py(ay)} x2={px(bx)} y2={py(by)} stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" />
        </>
      )}
      {/* AB 连线 */}
      <line x1={px(ax)} y1={py(ay)} x2={px(bx)} y2={py(by)} stroke={C.blue} strokeWidth="3" />
      {/* 两点 */}
      <circle cx={px(ax)} cy={py(ay)} r="5" fill={C.blue} />
      <circle cx={px(bx)} cy={py(by)} r="5" fill={C.blue} />
      <text x={px(ax) - 6} y={py(ay) - 9} textAnchor="end" fill={C.ink} fontSize="13" fontWeight="700">A({ax},{ay})</text>
      <text x={px(bx) + 6} y={py(by) - 9} fill={C.ink} fontSize="13" fontWeight="700">B({bx},{by})</text>
    </svg>
  );
}

export default function GeometrySVG({ visual }) {
  if (!visual) return null;
  let inner = null;
  if (visual.kind === 'line') inner = <LineFigure variant={visual.variant} />;
  else if (visual.kind === 'angle') inner = <AngleFigure degrees={visual.degrees} />;
  else if (visual.kind === 'rect') inner = <RectFigure {...visual} />;
  else if (visual.kind === 'symmetry') inner = <SymmetryFigure shape={visual.shape} />;
  else if (visual.kind === 'points') inner = <PointsFigure {...visual} />;
  else return null;
  return <div className="geo-wrap">{inner}</div>;
}
