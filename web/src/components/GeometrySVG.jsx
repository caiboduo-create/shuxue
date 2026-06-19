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

// 轴对称：根据 shape 画出对应图形，供"数对称轴 / 判断是否轴对称"题目配图
function SymmetryFigure({ shape }) {
  const cx = 100;
  const cy = 100;
  const r = 68;

  // 生成正多边形顶点（一个顶点朝正上方）
  const regular = (n) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      pts.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
    }
    return pts.join(' ');
  };

  const POLY = {
    square: '40,40 160,40 160,160 40,160',
    rect: '28,55 172,55 172,145 28,145',
    equilateral: regular(3),
    isosceles: '100,30 48,165 152,165',
    isoTrapezoid: '68,52 132,52 168,162 32,162',
    pentagon: regular(5),
    hexagon: regular(6),
    parallelogram: '52,58 178,58 148,158 22,158',
  };

  const fill = '#eff5ff';
  const stroke = C.blue;

  return (
    <svg viewBox="0 0 200 200" width="100%" style={{ maxWidth: 240 }}>
      {shape === 'circle' ? (
        <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth="2.5" />
      ) : (
        <polygon points={POLY[shape] || POLY.square} fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinejoin="round" />
      )}
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
  else return null;
  return <div className="geo-wrap">{inner}</div>;
}
