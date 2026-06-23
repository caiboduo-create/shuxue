// 互动课件注册中心。
// 新增一个互动课件：写一个 XxxDemo.jsx，然后在这里加一条记录即可，
// 首页入口、课件列表、知识点页跳转都会自动带上它。
import SectorDemo from './SectorDemo.jsx';
import AngleDemo from './AngleDemo.jsx';
import LineTypeDemo from './LineTypeDemo.jsx';
import SymmetryDemo from './SymmetryDemo.jsx';
import DistanceDemo from './DistanceDemo.jsx';
import CircleDemo from './CircleDemo.jsx';
import TriangleDemo from './TriangleDemo.jsx';
import LinearFunctionDemo from './LinearFunctionDemo.jsx';
import RectangleDemo from './RectangleDemo.jsx';
import FractionDemo from './FractionDemo.jsx';
import NumberLineDemo from './NumberLineDemo.jsx';
import SpinnerDemo from './SpinnerDemo.jsx';
import PointLineDemo from './PointLineDemo.jsx';
import RatioScaleDemo from './RatioScaleDemo.jsx';

export const INTERACTIVE = [
  {
    id: 'sector',
    title: '扇形面积',
    subtitle: '拖半径和圆心角，看面积怎么算',
    emoji: '🍕',
    category: '图形与几何',
    grades: [6, 9],
    topicId: 'sector-area',
    Component: SectorDemo,
  },
  {
    id: 'angle',
    title: '角的大小',
    subtitle: '转动一条边，认识锐角直角钝角',
    emoji: '📐',
    category: '图形与几何',
    grades: [4, 5],
    topicId: 'angles',
    Component: AngleDemo,
  },
  {
    id: 'line-types',
    title: '线段·射线·直线',
    subtitle: '拖动端点，看清三种线的区别',
    emoji: '📏',
    category: '图形与几何',
    grades: [4],
    topicId: 'line-types',
    Component: LineTypeDemo,
  },
  {
    id: 'symmetry',
    title: '轴对称',
    subtitle: '拖动一个点，找它镜子里的像',
    emoji: '🦋',
    category: '图形与几何',
    grades: [4, 5],
    topicId: 'symmetry-axis',
    Component: SymmetryDemo,
  },
  {
    id: 'distance',
    title: '两点间距离',
    subtitle: '拖动两个点，用勾股定理量距离',
    emoji: '📍',
    category: '图形与几何',
    grades: [8],
    topicId: 'distance-points',
    Component: DistanceDemo,
  },
  {
    id: 'rectangle',
    title: '长方形面积与周长',
    subtitle: '调长和宽，看面积、周长怎么变',
    emoji: '🟦',
    category: '图形与几何',
    grades: [3, 4],
    topicId: 'area-rect',
    Component: RectangleDemo,
  },
  {
    id: 'circle',
    title: '圆的面积与周长',
    subtitle: '拖半径，圆实时变大变小',
    emoji: '⭕',
    category: '图形与几何',
    grades: [6],
    topicId: 'circle-measure',
    Component: CircleDemo,
  },
  {
    id: 'triangle',
    title: '三角形内角和',
    subtitle: '调两个角，看第三个角和形状变化',
    emoji: '🔺',
    category: '图形与几何',
    grades: [4, 7],
    topicId: 'triangle-angle-sum',
    Component: TriangleDemo,
  },
  {
    id: 'linear-function',
    title: '一次函数 y=kx+b',
    subtitle: '调 k、b，直线实时变化',
    emoji: '📈',
    category: '函数图像',
    grades: [8],
    topicId: 'linear-function',
    Component: LinearFunctionDemo,
  },
  {
    id: 'fraction',
    title: '分数的比较与加减',
    subtitle: '改分子分母，方格图直观看分数',
    emoji: '🍰',
    category: '数与代数',
    grades: [3, 4, 5],
    topicId: 'fraction-visual',
    Component: FractionDemo,
  },
  {
    id: 'ratio-scale',
    title: '比例尺与图形缩放',
    subtitle: '调图上距离和比例尺，看实际距离怎样变化',
    emoji: '📏',
    category: '数与运算',
    grades: [5, 6, 7],
    topicId: 'ratio-scale',
    Component: RatioScaleDemo,
  },
  {
    id: 'number-line',
    title: '有理数加减（数轴）',
    subtitle: '在数轴上走一走，看懂正负号',
    emoji: '➕',
    category: '数与运算',
    grades: [7],
    topicId: 'rational-ops',
    Component: NumberLineDemo,
  },
  {
    id: 'spinner',
    title: '简单概率（转盘）',
    subtitle: '调份数，看概率是几分之几',
    emoji: '🎯',
    category: '统计与概率',
    grades: [7, 8],
    topicId: 'probability-basic',
    Component: SpinnerDemo,
  },
  {
    id: 'point-line',
    title: '点到直线的距离',
    subtitle: '移动点或直线，看垂线段变化',
    emoji: '📐',
    category: '图形与几何',
    grades: [8, 9],
    topicId: 'distance-point-line',
    Component: PointLineDemo,
  },
];

const byId = new Map(INTERACTIVE.map((d) => [d.id, d]));
const byTopic = new Map(INTERACTIVE.map((d) => [d.topicId, d]));

export const getDemo = (id) => byId.get(id);
export const getDemoByTopic = (topicId) => byTopic.get(topicId);
