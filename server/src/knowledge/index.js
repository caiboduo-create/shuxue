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
import symmetry from './topics/symmetry.js';

const TOPICS = [
  addSub,
  mulDiv,
  lineTypes,
  angles,
  perimeter,
  areaRect,
  symmetry,
  linearEq,
  rationalOps,
  probability,
];

const byId = new Map(TOPICS.map((t) => [t.id, t]));

export function getTopic(id) {
  return byId.get(id);
}

// 返回某年级可用的知识点（精简信息，不含解题逻辑）
export function listTopics(grade) {
  const g = Number(grade);
  return TOPICS.filter((t) => !g || t.grades.includes(g)).map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category,
    grades: t.grades,
    difficulties: t.difficulties,
  }));
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
