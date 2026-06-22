// 知识点注册中心
// 新增知识点只需：1) 在 topics/ 下新建一个模块文件  2) 在这里 import 并加入数组
// 系统会自动出现在对应年级的列表里。这就是"知识点模块化、可扩展"的落点。

import addSub from './topics/add-sub.js';
import mulDiv from './topics/mul-div.js';
import lineTypes from './topics/line-types.js';
import angles from './topics/angles.js';
import perimeter from './topics/perimeter.js';
import areaRect from './topics/area-rect.js';
import linearEq from './topics/linear-eq.js';
import rationalOps from './topics/rational-ops.js';
import probability from './topics/probability-basic.js';
import symmetryAxis from './topics/symmetry-axis.js';
import distancePoints from './topics/distance-points.js';
import distancePointLine from './topics/distance-point-line.js';
import sectorArea from './topics/sector-area.js';
import circleMeasure from './topics/circle-measure.js';
import triangleAngleSum from './topics/triangle-angle-sum.js';
import linearFunction from './topics/linear-function.js';
import fractionVisual from './topics/fraction-visual.js';
import ratioScale from './topics/ratio-scale.js';
import { PRIMARY_CURRICULUM } from './curriculum.js';

const TOPICS = [
  addSub,
  mulDiv,
  lineTypes,
  angles,
  perimeter,
  areaRect,
  linearEq,
  rationalOps,
  probability,
  symmetryAxis,
  distancePoints,
  distancePointLine,
  sectorArea,
  circleMeasure,
  triangleAngleSum,
  linearFunction,
  fractionVisual,
  ratioScale,
];

const byId = new Map(TOPICS.map((t) => [t.id, t]));

export function getTopic(id) {
  return byId.get(id);
}

function publicTopic(t) {
  return {
    id: t.id,
    title: t.title,
    category: t.category,
    grades: t.grades,
    difficulties: t.difficulties,
    objective: t.objective || '',
  };
}

function publicPlacement(book, unit, placement, index) {
  const topic = getTopic(placement.topicId);
  if (!topic) return null;
  return {
    ...publicTopic(topic),
    placementId: `${book.id}-u${unit.unit}-${placement.topicId}-${index}`,
    title: placement.displayTitle || topic.title,
    baseTitle: topic.title,
    grades: [book.grade],
    bookId: book.id,
    bookTitle: book.title,
    volume: book.volume,
    volumeLabel: book.volumeLabel,
    unit: unit.unit,
    unitTitle: unit.title,
    scope: placement.scope || null,
    objective: placement.objective || topic.objective || '',
  };
}

// 返回某年级可用的知识点（精简信息，不含解题逻辑）
// 有 grade 时按教材位置展开；无 grade 时返回原始知识点，供学习页深链查找。
export function listTopics(grade) {
  const g = Number(grade);
  if (!g) return TOPICS.map(publicTopic);

  return listCurriculum(g).books.flatMap((book) =>
    book.units.flatMap((unit) => unit.topics)
  );
}

// 教材目录结构：年级 -> 上/下册 -> 单元 -> 当前已接入知识点
export function listCurriculum(grade) {
  const g = Number(grade);
  const middleGradeLabel = ['初一', '初二', '初三'][g - 7] || `初${g - 6}`;
  const books = PRIMARY_CURRICULUM.filter((book) => !g || book.grade === g).map((book) => {
    const units = book.units.map((unit) => {
      const topics = (unit.topics || [])
        .map((placement, index) => publicPlacement(book, unit, placement, index))
        .filter(Boolean);

      return {
        unit: unit.unit,
        title: unit.title,
        topics,
        availableCount: topics.length,
      };
    });

    return {
      id: book.id,
      stage: book.stage,
      grade: book.grade,
      volume: book.volume,
      volumeLabel: book.volumeLabel,
      title: book.title,
      units,
      availableCount: units.reduce((sum, unit) => sum + unit.availableCount, 0),
    };
  });

  if (g > 6 && books.length === 0) {
    const topics = TOPICS.filter((topic) => topic.grades.includes(g)).map(publicTopic);
    const categories = Array.from(new Set(topics.map((topic) => topic.category)));
    const units = categories.map((category, index) => {
      const unitTopics = topics
        .filter((topic) => topic.category === category)
        .map((topic, topicIndex) => ({
          ...topic,
          placementId: `g${g}-general-u${index + 1}-${topic.id}-${topicIndex}`,
          grades: [g],
          bookId: `g${g}-general`,
          bookTitle: `${middleGradeLabel}知识点`,
          volume: 'general',
          volumeLabel: '初中',
          unit: index + 1,
          unitTitle: category,
        }));
      return {
        unit: index + 1,
        title: category,
        topics: unitTopics,
        availableCount: unitTopics.length,
      };
    });

    return {
      grade: g,
      books: [
        {
          id: `g${g}-general`,
          stage: '初中',
          grade: g,
          volume: 'general',
          volumeLabel: '初中',
          title: `${middleGradeLabel}知识点`,
          units,
          availableCount: topics.length,
        },
      ],
    };
  }

  return { grade: g || null, books };
}

export function getPlacement(placementId) {
  if (!placementId) return null;
  const match = String(placementId).match(/^g(\d+)/);
  const grade = match ? Number(match[1]) : undefined;
  const books = listCurriculum(grade).books;

  for (const book of books) {
    for (const unit of book.units) {
      const found = unit.topics.find((topic) => topic.placementId === placementId);
      if (found) return found;
    }
  }

  return null;
}

// 年级元信息，供前端"年级选择"页使用
export const GRADES = [
  { value: 1, label: '一年级', stage: '小学' },
  { value: 2, label: '二年级', stage: '小学' },
  { value: 3, label: '三年级', stage: '小学' },
  { value: 4, label: '四年级', stage: '小学' },
  { value: 5, label: '五年级', stage: '小学' },
  { value: 6, label: '六年级', stage: '小学' },
  { value: 7, label: '初一（7年级）', stage: '初中' },
  { value: 8, label: '初二（8年级）', stage: '初中' },
  { value: 9, label: '初三（9年级）', stage: '初中' },
];

export default TOPICS;
