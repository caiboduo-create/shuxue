// 互动课件注册中心。
// 新增一个互动课件：写一个 XxxDemo.jsx，然后在这里加一条记录即可，
// 首页入口、课件列表、知识点页跳转都会自动带上它。
import SectorDemo from './SectorDemo.jsx';
import AngleDemo from './AngleDemo.jsx';
import LineTypeDemo from './LineTypeDemo.jsx';
import SymmetryDemo from './SymmetryDemo.jsx';
import DistanceDemo from './DistanceDemo.jsx';

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
];

const byId = new Map(INTERACTIVE.map((d) => [d.id, d]));
const byTopic = new Map(INTERACTIVE.map((d) => [d.topicId, d]));

export const getDemo = (id) => byId.get(id);
export const getDemoByTopic = (topicId) => byTopic.get(topicId);
