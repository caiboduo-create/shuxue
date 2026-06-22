import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';

function resizeImage(file, maxSide = 1600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('图片读取失败'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('图片解析失败'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function PhotoSolve() {
  const inputRef = useRef(null);
  const [imageData, setImageData] = useState('');
  const [fileName, setFileName] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null);

  const pickImage = async (file) => {
    if (!file) return;
    setErr('');
    setResult(null);
    try {
      const data = await resizeImage(file);
      setImageData(data);
      setFileName(file.name || '拍摄的题目');
    } catch (e) {
      setErr(e.message || '图片处理失败');
    }
  };

  const submit = async () => {
    if (!imageData || busy) return;
    setBusy(true);
    setErr('');
    setResult(null);
    try {
      const data = await api.photoSolve({ imageData, note });
      setResult(data);
    } catch (e) {
      setErr(e.message || '解析失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Link to="/" className="back home-back">返回首页</Link>

      <section className="page-panel blue photo-hero mt12">
        <div>
          <span className="badge amber">AI 拍照答题</span>
          <h2 className="mt8">拍下数学题，自动识别并讲解。</h2>
          <p className="panel-sub">
            支持手机拍照或上传图片。后面配置好 API Key 后，这里会直接返回题目识别、答案和分步讲解。
          </p>
        </div>
      </section>

      <section className="content-card photo-card mt16">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="photo-input"
          onChange={(e) => pickImage(e.target.files?.[0])}
        />

        <div className="photo-layout">
          <div className="photo-preview">
            {imageData ? (
              <img src={imageData} alt="题目预览" />
            ) : (
              <div className="photo-empty">
                <div className="photo-empty-icon">拍</div>
                <div>拍照或上传一道数学题</div>
              </div>
            )}
          </div>

          <div className="photo-tools">
            <div>
              <div className="badge">题目图片</div>
              <h3 className="mt8">{fileName || '还没有选择图片'}</h3>
              <p className="muted mt8">
                尽量让题目文字清楚、光线均匀，少拍到无关内容。
              </p>
            </div>

            <label className="photo-note">
              <span>补充说明（可选）</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="比如：只讲第 3 小题 / 用小学六年级方法讲"
              />
            </label>

            <div className="row wrap photo-actions">
              <button type="button" className="btn btn-ghost" onClick={() => inputRef.current?.click()}>
                拍照/上传
              </button>
              <button type="button" className="btn btn-primary" disabled={!imageData || busy} onClick={submit}>
                {busy ? '正在解析…' : 'AI 解析题目'}
              </button>
            </div>
          </div>
        </div>

        {err && <div className="verdict no mt16">{err}</div>}

        {result && (
          <section className="photo-result mt16">
            <div className="row between wrap">
              <div>
                <span className="badge green">{result.source === 'openai' ? 'AI 已解析' : '接口已准备'}</span>
                <h3 className="mt8">{result.title || '解析结果'}</h3>
              </div>
            </div>

            {result.question && (
              <div className="ex-block mt12">
                <h4>识别到的题目</h4>
                <p>{result.question}</p>
              </div>
            )}
            {result.answer && (
              <div className="ex-block mt12">
                <h4>答案</h4>
                <p>{result.answer}</p>
              </div>
            )}
            {Array.isArray(result.steps) && result.steps.length > 0 && (
              <div className="ex-block mt12">
                <h4>分步讲解</h4>
                <ol>
                  {result.steps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
            {result.summary && <div className="ex-summary mt12">{result.summary}</div>}
          </section>
        )}
      </section>
    </div>
  );
}
