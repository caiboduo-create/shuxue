// 互动课件公用小工具：指针拖动 + 坐标换算 + 数值收敛
import { useCallback } from 'react';

// 把一次指针事件的屏幕坐标换算成 SVG viewBox 内部坐标
export function svgPoint(svg, evt) {
  const rect = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  const x = ((evt.clientX - rect.left) / rect.width) * vb.width + vb.x;
  const y = ((evt.clientY - rect.top) / rect.height) * vb.height + vb.y;
  return { x, y };
}

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const round2 = (v) => Math.round(v * 100) / 100;

// 拖动手柄通用 hook：
// 返回一个 onPointerDown 处理器，按下后在 window 上监听 move/up，
// 每次移动都把「viewBox 内坐标」交给 onDrag 回调（请在回调里用函数式 setState）。
// 用 window 监听是为了手指/鼠标移出图形区域仍能继续拖动，体验更顺。
export function useSvgDrag(svgRef, onDrag) {
  return useCallback(
    (e) => {
      e.preventDefault();
      const svg = svgRef.current;
      if (!svg) return;
      const fire = (ev) => onDrag(svgPoint(svg, ev));
      const stop = () => {
        window.removeEventListener('pointermove', fire);
        window.removeEventListener('pointerup', stop);
        window.removeEventListener('pointercancel', stop);
      };
      window.addEventListener('pointermove', fire);
      window.addEventListener('pointerup', stop);
      window.addEventListener('pointercancel', stop);
      fire(e); // 按下即跳到当前位置，手感更直接
    },
    [svgRef, onDrag]
  );
}
