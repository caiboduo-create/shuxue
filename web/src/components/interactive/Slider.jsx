// 带标签和实时数值的滑块，互动课件统一用它做"数值滑块"控件
export default function Slider({ label, value, min, max, step = 1, unit = '', onChange }) {
  return (
    <label className="islider">
      <span className="islider-top">
        <span className="islider-label">{label}</span>
        <span className="islider-val">
          {value}
          {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
