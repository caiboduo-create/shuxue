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
  // 顶点放在足够靠右的位置（vx ≥ len），这样钝角/平角（边指向左侧）也不会被裁出画面
  const vx = 140;
  const vy = 150;
  const len = 120;
  const rad = (degrees * Math.PI) / 180;
  // 一条边水平向右，另一条边按角度向上旋转（屏幕 y 向下，所以取减）
  const x2 = vx + len;
  const y2 = vy;
  const x3 = vx + len * Math.cos(rad);
  const y3 = vy - len * Math.sin(rad);
  const arcR = 36;
  const bx = vx + arcR * Math.cos(rad);
  const by = vy - arcR * Math.sin(rad);
  const largeArc = degrees > 180 ? 1 : 0;
  return (
    <svg viewBox="0 0 280 190" width="100%" style={{ maxWidth: 320 }}>
      <line x1={vx} y1={vy} x2={x2} y2={y2} stroke={C.blue} strokeWidth="3" />
      <line x1={vx} y1={vy} x2={x3} y2={y3} stroke={C.blue} strokeWidth="3" />
      <path
        d={`M ${vx + arcR} ${vy} A ${arcR} ${arcR} 0 ${largeArc} 0 ${bx} ${by}`}
        fill="none"
        stroke={C.amber}
        strokeWidth="2.5"
      />
      <circle cx={vx} cy={vy} r="4" fill={C.ink} />
      {/* 度数标签固定在左上角，绝不和图形重叠或被裁切 */}
      <text x="16" y="30" fill="#b45309" fontSize="17" fontWeight="700">{degrees}°</text>
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
  // 只有单位格画得够大（≥12px）才画网格，避免数值很大时网格过密成一团
  if (grid && scale >= 12) {
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
  // 坐标范围大时按步长画网格，避免线太密
  const gstep = maxC > 16 ? Math.ceil(maxC / 12) : 1;
  for (let i = 0; i <= maxC; i += gstep) {
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
      <text x={px(ax) + (ax <= 0 ? 6 : -6)} y={py(ay) - 9} textAnchor={ax <= 0 ? 'start' : 'end'} fill={C.ink} fontSize="13" fontWeight="700">A({ax},{ay})</text>
      <text x={px(bx) + (bx >= maxC ? -6 : 6)} y={py(by) - 9} textAnchor={bx >= maxC ? 'end' : 'start'} fill={C.ink} fontSize="13" fontWeight="700">B({bx},{by})</text>
    </svg>
  );
}

// 点到直线图：第一象限网格 + 直线 + 点 P + 到直线的垂线段（虚线，即距离）
function PointLineFigure({ a, b, c, x0, y0, maxC }) {
  const m = maxC || Math.max(x0, y0, 6);
  const scale = Math.min(220 / m, 26);
  const pad = 30;
  const gp = m * scale;
  const W = gp + pad * 2;
  const H = gp + pad * 2;
  const px = (x) => pad + x * scale;
  const py = (y) => H - pad - y * scale;

  const grid = [];
  const gstep = m > 16 ? Math.ceil(m / 12) : 1;
  for (let i = 0; i <= m; i += gstep) {
    grid.push(<line key={`gx${i}`} x1={px(i)} y1={py(0)} x2={px(i)} y2={py(m)} stroke={C.faint} strokeWidth="1" />);
    grid.push(<line key={`gy${i}`} x1={px(0)} y1={py(i)} x2={px(m)} y2={py(i)} stroke={C.faint} strokeWidth="1" />);
  }

  // 直线与网格边框 [0,m]×[0,m] 的交点，取两个不同的点画线段
  const hits = [];
  if (b !== 0) {
    const yL = -c / b;
    if (yL >= 0 && yL <= m) hits.push([0, yL]);
    const yR = -(a * m + c) / b;
    if (yR >= 0 && yR <= m) hits.push([m, yR]);
  }
  if (a !== 0) {
    const xB = -c / a;
    if (xB >= 0 && xB <= m) hits.push([xB, 0]);
    const xT = -(b * m + c) / a;
    if (xT >= 0 && xT <= m) hits.push([xT, m]);
  }
  const ends = [];
  for (const p of hits) {
    if (!ends.some((q) => Math.abs(q[0] - p[0]) < 1e-6 && Math.abs(q[1] - p[1]) < 1e-6)) ends.push(p);
    if (ends.length === 2) break;
  }

  // 垂足：把点 P 投影到直线上
  const denom = a * a + b * b;
  const n = a * x0 + b * y0 + c;
  const fx = x0 - (n * a) / denom;
  const fy = y0 - (n * b) / denom;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: Math.max(W, 220) }}>
      {grid}
      {/* 坐标轴 */}
      <line x1={px(0)} y1={py(0)} x2={px(m)} y2={py(0)} stroke={C.ink} strokeWidth="1.5" />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(m)} stroke={C.ink} strokeWidth="1.5" />
      {/* 直线 */}
      {ends.length === 2 && (
        <line x1={px(ends[0][0])} y1={py(ends[0][1])} x2={px(ends[1][0])} y2={py(ends[1][1])} stroke={C.blue} strokeWidth="3" />
      )}
      {/* 垂线段（即点到直线的距离） */}
      <line x1={px(x0)} y1={py(y0)} x2={px(fx)} y2={py(fy)} stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" />
      {/* 垂足与点 P */}
      <circle cx={px(fx)} cy={py(fy)} r="5" fill={C.amber} stroke="#fff" strokeWidth="1.5" />
      <circle cx={px(x0)} cy={py(y0)} r="8" fill={C.blue} stroke="#fff" strokeWidth="2" />
      <text x={px(x0) + 7} y={py(y0) - 8} fill={C.ink} fontSize="13" fontWeight="700">P({x0},{y0})</text>
      <text x="50%" y={H - 6} textAnchor="middle" fill="#94a3b8" fontSize="13">虚线为 P 到直线的垂线段（即距离）</text>
    </svg>
  );
}

// 圆：画出圆并标出半径或直径（圆的面积/周长题配图）。
// 屏幕半径随 r 平滑缩放并夹在范围内，这样互动课件里拖动 r 时圆会明显变大变小。
function CircleFigure({ r, given, givenValue }) {
  const R = Math.max(26, Math.min(92, r * 8));
  const cx = 110;
  const cy = 100;
  return (
    <svg viewBox="0 0 220 200" width="100%" style={{ maxWidth: 280 }}>
      <circle cx={cx} cy={cy} r={R} fill="#eff5ff" stroke={C.blue} strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r="3.5" fill={C.ink} />
      {given === 'diameter' ? (
        <>
          <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke={C.amber} strokeWidth="2.5" />
          <text x={cx} y={cy - 10} textAnchor="middle" fill="#b45309" fontSize="14" fontWeight="700">直径 {givenValue}</text>
        </>
      ) : (
        <>
          <line x1={cx} y1={cy} x2={cx + R} y2={cy} stroke={C.amber} strokeWidth="2.5" />
          <text x={cx + R / 2} y={cy - 10} textAnchor="middle" fill="#b45309" fontSize="14" fontWeight="700">r = {givenValue}</text>
        </>
      )}
    </svg>
  );
}

// 三角形：按给定的三个内角真实绘制，并标出每个角的度数
function TriangleFigure({ angles }) {
  const [a, b, c] = angles;
  const ra = (a * Math.PI) / 180;
  const rb = (b * Math.PI) / 180;
  // 底边 AB 在水平线上，A 在左、B 在右；用两角求顶点 C（数学坐标，y 向上）
  const L = 1;
  const cxMath = (L * Math.tan(rb)) / (Math.tan(ra) + Math.tan(rb));
  const cyMath = Math.tan(ra) * cxMath;
  // 归一化到画布
  const pts = [
    [0, 0],
    [L, 0],
    [cxMath, cyMath],
  ];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  const pad = 34;
  const w = 240;
  const scale = (w - pad * 2) / (maxX - minX);
  const h = maxY * scale + pad * 2;
  // 转屏幕坐标（y 翻转）
  const sp = pts.map(([x, y]) => [pad + (x - minX) * scale, h - pad - y * scale]);
  const [A, B, Cc] = sp;
  // 角标签放在顶点稍微往三角形内部
  const cxc = (A[0] + B[0] + Cc[0]) / 3;
  const cyc = (A[1] + B[1] + Cc[1]) / 3;
  const lbl = (P, deg) => {
    const dx = cxc - P[0];
    const dy = cyc - P[1];
    const len = Math.hypot(dx, dy) || 1;
    return [P[0] + (dx / len) * 26, P[1] + (dy / len) * 26 + 4];
  };
  const la = lbl(A, a);
  const lb = lbl(B, b);
  const lc = lbl(Cc, c);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ maxWidth: 320 }}>
      <polygon points={sp.map((p) => p.join(',')).join(' ')} fill="#eff5ff" stroke={C.blue} strokeWidth="2.5" />
      <text x={la[0]} y={la[1]} textAnchor="middle" fill={C.ink} fontSize="13" fontWeight="700">{a}°</text>
      <text x={lb[0]} y={lb[1]} textAnchor="middle" fill={C.ink} fontSize="13" fontWeight="700">{b}°</text>
      <text x={lc[0]} y={lc[1]} textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="700">?</text>
    </svg>
  );
}

// 一次函数：坐标系 + 直线 y=kx+b + 标出点 (x, kx+b)
// 坐标范围按 k/b/x 自适应，保证点 (x, y) 与截距永远落在画面内（大数值也不裁切）。
function LinearGraphFigure({ k, b, x }) {
  const y = k * x + b;
  // 自适应半轴范围：覆盖 x、y、b，并向上取整到偶数
  const span = Math.max(6, Math.ceil(Math.max(Math.abs(x), Math.abs(y), Math.abs(b)) / 2) * 2);
  const half = 118; // 画布半边像素
  const O = half + 16; // 原点像素（留边距给标签）
  const VB = O * 2;
  const sc = half / span; // 每单位像素
  const px = (vx) => O + vx * sc;
  const py = (vy) => O - vy * sc;
  const gstep = span > 12 ? Math.ceil(span / 6) : span > 6 ? 2 : 1;
  const grid = [];
  for (let i = -span; i <= span; i += gstep) {
    grid.push(<line key={`v${i}`} x1={px(i)} y1={py(-span)} x2={px(i)} y2={py(span)} stroke={C.faint} strokeWidth="1" />);
    grid.push(<line key={`h${i}`} x1={px(-span)} y1={py(i)} x2={px(span)} y2={py(i)} stroke={C.faint} strokeWidth="1" />);
  }
  // 直线画满整个 x 范围；超出画布的部分由 SVG 视口自动裁掉，斜率始终正确
  const lx1 = -span;
  const lx2 = span;
  const rightHalf = px(x) > O;
  return (
    <svg viewBox={`0 0 ${VB} ${VB}`} width="100%" style={{ maxWidth: 300 }}>
      {grid}
      <line x1={px(-span)} y1={py(0)} x2={px(span)} y2={py(0)} stroke={C.ink} strokeWidth="1.5" />
      <line x1={px(0)} y1={py(-span)} x2={px(0)} y2={py(span)} stroke={C.ink} strokeWidth="1.5" />
      <line x1={px(lx1)} y1={py(k * lx1 + b)} x2={px(lx2)} y2={py(k * lx2 + b)} stroke={C.blue} strokeWidth="3" />
      <line x1={px(x)} y1={py(0)} x2={px(x)} y2={py(y)} stroke={C.amber} strokeWidth="1.5" strokeDasharray="4 3" />
      <line x1={px(0)} y1={py(y)} x2={px(x)} y2={py(y)} stroke={C.amber} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx={px(x)} cy={py(y)} r="5" fill={C.amber} />
      <text x={px(x) + (rightHalf ? -8 : 8)} y={py(y) + (y >= 0 ? -8 : 16)} textAnchor={rightHalf ? 'end' : 'start'} fill="#b45309" fontSize="12" fontWeight="700">({x}, {y})</text>
    </svg>
  );
}

// 分数：用方格条形图显示分数。标签放在条形左侧（右对齐），运算符放在两条之间的空隙，
// 都留足边距，避免数字被裁切或与图形重叠。
function FractionBar({ n, d, x, y, w, h }) {
  const cw = w / d;
  const cells = [];
  for (let i = 0; i < d; i++) {
    cells.push(
      <rect
        key={i}
        x={x + i * cw}
        y={y}
        width={cw}
        height={h}
        fill={i < n ? '#bcd3ff' : '#fff'}
        stroke={C.blue}
        strokeWidth="1.2"
      />
    );
  }
  return <g>{cells}</g>;
}

function FractionFigure({ layout, op, a, b }) {
  const W = 300;
  const H = 150;
  const labelX = 56; // 标签右边界（右对齐，文字向左延伸，留出左边距）
  const barX = 66;
  const barW = 200;
  const barH = 36;
  const yA = 24;
  const yB = 88;
  const gapMid = (yA + barH + yB) / 2 + 6; // 两条之间的空隙中线
  const symbol = layout === 'op' ? op : '?';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
      <text x={labelX} y={yA + barH / 2 + 5} textAnchor="end" fill={C.ink} fontSize="16" fontWeight="700">{a.n}/{a.d}</text>
      <FractionBar n={a.n} d={a.d} x={barX} y={yA} w={barW} h={barH} />
      <text x={labelX} y={yB + barH / 2 + 5} textAnchor="end" fill={C.ink} fontSize="16" fontWeight="700">{b.n}/{b.d}</text>
      <FractionBar n={b.n} d={b.d} x={barX} y={yB} w={barW} h={barH} />
      <text x={barX + barW / 2} y={gapMid} textAnchor="middle" fill={C.ink} fontSize="22" fontWeight="800">{symbol}</text>
    </svg>
  );
}

// 扇形：画整圆 + 扇形 + 半径 + 圆心角弧（半径随 r 缩放）
function SectorFigure({ r, theta }) {
  const cx = 110;
  const cy = 110;
  const R = Math.max(40, Math.min(92, r * 9));
  const rad = (theta * Math.PI) / 180;
  const sx = cx + R;
  const sy = cy;
  const ex = cx + R * Math.cos(rad);
  const ey = cy - R * Math.sin(rad);
  const large = theta > 180 ? 1 : 0;
  const path = `M ${cx} ${cy} L ${sx} ${sy} A ${R} ${R} 0 ${large} 0 ${ex} ${ey} Z`;
  return (
    <svg viewBox="0 0 220 220" width="100%" style={{ maxWidth: 260 }}>
      <circle cx={cx} cy={cy} r={R} fill="#f1f5fd" stroke="#cdd9ec" strokeWidth="1.5" />
      <path d={path} fill="#dbe7ff" stroke={C.blue} strokeWidth="2.5" />
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={C.blue} strokeWidth="2" />
      <path
        d={`M ${cx + 24} ${cy} A 24 24 0 ${large} 0 ${cx + 24 * Math.cos(rad)} ${cy - 24 * Math.sin(rad)}`}
        fill="none"
        stroke={C.amber}
        strokeWidth="2.5"
      />
      <text x={cx + 30} y={cy - 12} fill="#b45309" fontSize="13" fontWeight="700">{theta}°</text>
      <text x={cx + R / 2} y={cy - 7} textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="700">r={r}</text>
      <circle cx={cx} cy={cy} r="3.5" fill={C.ink} />
    </svg>
  );
}

// 数轴：从 a 出发，按运算移动到结果，直观展示"加正数向右 / 加负数向左 / 减一个数 = 加相反数"
function NumberLineFigure({ a, b, op }) {
  const result = op === '+' ? a + b : a - b;
  const lo = Math.min(0, a, result) - 1;
  const hi = Math.max(0, a, result) + 1;
  const range = hi - lo;
  const W = 340;
  const pad = 24;
  const y = 62;
  const sc = (W - pad * 2) / range;
  const X = (v) => pad + (v - lo) * sc;
  const step = range > 24 ? Math.ceil(range / 16) : 1;
  const ticks = [];
  for (let v = Math.ceil(lo); v <= Math.floor(hi); v += step) {
    ticks.push(<line key={`t${v}`} x1={X(v)} y1={y - 4} x2={X(v)} y2={y + 4} stroke="#94a3b8" strokeWidth="1" />);
    ticks.push(<text key={`l${v}`} x={X(v)} y={y + 18} textAnchor="middle" fill="#94a3b8" fontSize="10">{v}</text>);
  }
  const dir = result >= a ? 1 : -1;
  return (
    <svg viewBox={`0 0 ${W} 112`} width="100%" style={{ maxWidth: 380 }}>
      <line x1={pad - 6} y1={y} x2={W - pad + 6} y2={y} stroke={C.ink} strokeWidth="1.5" />
      {ticks}
      {/* 0 处加粗 */}
      <line x1={X(0)} y1={y - 7} x2={X(0)} y2={y + 7} stroke={C.ink} strokeWidth="2" />
      {/* 从起点跳到结果的弧线 + 箭头（橙色 = 这一步的移动） */}
      {result !== a && (
        <>
          <path d={`M ${X(a)} ${y - 9} Q ${(X(a) + X(result)) / 2} ${y - 40} ${X(result)} ${y - 9}`} fill="none" stroke={C.amber} strokeWidth="3" />
          <polygon points={`${X(result)},${y - 7} ${X(result) - dir * 9},${y - 13} ${X(result) - dir * 9},${y - 1}`} fill={C.amber} />
          <text x={(X(a) + X(result)) / 2} y={y - 44} textAnchor="middle" fill="#b45309" fontSize="13" fontWeight="700">{op} ({b})</text>
        </>
      )}
      {/* 起点：蓝色大圆点，标在下方 */}
      <circle cx={X(a)} cy={y} r="9" fill={C.blue} stroke="#fff" strokeWidth="2.5" />
      <text x={X(a)} y={y + 36} textAnchor="middle" fill={C.blue} fontSize="13" fontWeight="700">起点</text>
      {/* 结果：绿色大圆点，标在上方 */}
      <circle cx={X(result)} cy={y} r="9" fill={C.green} stroke="#fff" strokeWidth="2.5" />
      <text x={X(result)} y={y - 18} textAnchor="middle" fill={C.green} fontSize="13" fontWeight="700">结果</text>
    </svg>
  );
}

// 转盘：按各结果的份数画扇区，高亮目标结果，直观展示概率 = 目标份数 / 总份数
function SpinnerFigure({ segments, targetIdx }) {
  const cx = 92;
  const cy = 95;
  const R = 72;
  const total = segments.reduce((s, x) => s + x.count, 0) || 1;
  let ang = -Math.PI / 2;
  const arcs = segments.map((seg, i) => {
    const frac = seg.count / total;
    const a0 = ang;
    const a1 = ang + frac * 2 * Math.PI;
    ang = a1;
    const x0 = cx + R * Math.cos(a0);
    const y0 = cy + R * Math.sin(a0);
    const x1 = cx + R * Math.cos(a1);
    const y1 = cy + R * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const d = `M ${cx} ${cy} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
    return (
      <path key={i} d={d} fill={seg.color} stroke="#fff" strokeWidth={i === targetIdx ? 3.5 : 1.5} opacity={targetIdx == null || i === targetIdx ? 1 : 0.45} />
    );
  });
  return (
    <svg viewBox="0 0 300 195" width="100%" style={{ maxWidth: 340 }}>
      {arcs}
      {/* 顶部指针 */}
      <polygon points={`${cx},${cy - R - 10} ${cx - 7},${cy - R + 4} ${cx + 7},${cy - R + 4}`} fill={C.ink} />
      {/* 图例 */}
      {segments.map((seg, i) => (
        <g key={i}>
          <rect x={186} y={36 + i * 26} width={16} height={16} rx="3" fill={seg.color} stroke={i === targetIdx ? C.ink : '#fff'} strokeWidth={i === targetIdx ? 2 : 1} />
          <text x={210} y={49 + i * 26} fill={C.ink} fontSize="14" fontWeight={i === targetIdx ? 700 : 500}>
            {seg.label} × {seg.count}{i === targetIdx ? '（目标）' : ''}
          </text>
        </g>
      ))}
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
  else if (visual.kind === 'point-line') inner = <PointLineFigure {...visual} />;
  else if (visual.kind === 'circle') inner = <CircleFigure {...visual} />;
  else if (visual.kind === 'triangle') inner = <TriangleFigure {...visual} />;
  else if (visual.kind === 'linear-graph') inner = <LinearGraphFigure {...visual} />;
  else if (visual.kind === 'fraction') inner = <FractionFigure {...visual} />;
  else if (visual.kind === 'sector') inner = <SectorFigure {...visual} />;
  else if (visual.kind === 'numberline') inner = <NumberLineFigure {...visual} />;
  else if (visual.kind === 'spinner') inner = <SpinnerFigure {...visual} />;
  else return null;
  return <div className="geo-wrap">{inner}</div>;
}
