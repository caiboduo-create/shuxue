import { Link, useNavigate } from 'react-router-dom';
import { weakestTopic } from '../lib/store.js';
import { INTERACTIVE } from '../components/interactive/index.js';

const compactTitle = (title) => title.replace(/[·•]/g, '');

function titleSizeClass(title) {
  const length = compactTitle(title).replace(/\s/g, '').length;
  if (length <= 4) return 'title-short';
  if (length <= 7) return 'title-medium';
  return 'title-long';
}

function preferredDemos(weak, limit = 9) {
  const weakDemo = weak ? INTERACTIVE.find((d) => d.topicId === weak.id) : null;
  const pool = weakDemo
    ? [
        weakDemo,
        ...INTERACTIVE.filter((d) => d.category === weakDemo.category),
        ...INTERACTIVE.filter((d) => d.grades.some((g) => weakDemo.grades.includes(g))),
        ...INTERACTIVE,
      ]
    : INTERACTIVE;

  return Array.from(new Map(pool.map((d) => [d.id, d])).values()).slice(0, limit);
}

export default function Home() {
  const nav = useNavigate();
  const weak = weakestTopic();
  const recommended = preferredDemos(weak);
  const interactivePreview = INTERACTIVE.slice(0, 9);
  const hasWeak = Boolean(weak);
  const openFromHome = (d) => {
    if (d.topicId) {
      nav(`/learn/${d.topicId}`, {
        state: { backTo: '/', backLabel: '返回首页' },
      });
      return;
    }
    nav(`/interactive/${d.id}`);
  };

  return (
    <div>
      <section className="page-panel pink home-section home-interactive">
        <div className="home-interactive-layout">
          <div className="home-interactive-main">
            <div className="home-interactive-copy">
              <div className="badge amber">互动课件</div>
              <div className="home-interactive-text">
                边拖边练，先看变化。
                <br />
                再随机出题。
              </div>
            </div>
            <div className="home-interactive-visual" aria-label="互动课件示意图">
              {interactivePreview.map((d) => (
                <button
                  key={d.id}
                  className="interactive-symbol"
                  onClick={() => openFromHome(d)}
                >
                  <span className="interactive-symbol-icon">{d.emoji}</span>
                  <span className={`interactive-symbol-title ${titleSizeClass(d.title)}`}>
                    {compactTitle(d.title)}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <Link to="/interactive" className="home-action-btn">全部课件</Link>
        </div>
      </section>

      <section className="page-panel blue home-hero home-section mt16">
        <div className="home-hero-main">
          <div className="home-hero-stack">
            <div className="home-hero-copy">
              <span className="badge amber">中小学数学 · AI 出题与讲解</span>
              <div className="home-hero-text mt8">
                边做题，边听老师讲。
                <br />
                每道题都有分步讲解和配图。
              </div>
            </div>
            <div className="home-hero-visual" aria-label="推荐知识点">
              {recommended.map((d) => (
                <Link
                  key={d.id}
                  to={d.topicId ? `/learn/${d.topicId}` : `/interactive/${d.id}`}
                  state={d.topicId ? { backTo: '/', backLabel: '返回首页' } : undefined}
                  className="hero-topic-card"
                >
                  <span className="hero-topic-icon">{d.emoji}</span>
                  <span className={`hero-topic-title ${titleSizeClass(d.title)}`}>
                    {compactTitle(d.title)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="home-hero-side">
            <Link to="/grades" className="home-action-btn">直接练习</Link>
          </div>
        </div>
      </section>

      <section className="page-panel orange home-section home-weak mt16">
        <div className="home-weak-layout">
          <div className="home-weak-main">
            <div className="home-weak-copy">
              <div className="badge amber">薄弱点提醒</div>
              <div className="home-weak-text mt8">
                {hasWeak ? (
                  <>
                    《{weak.title}》最近正确率偏低（{Math.round(weak.rate * 100)}%）
                    <br />
                    要不要针对这个知识点再练几道？
                  </>
                ) : (
                  <>
                    还没有练习记录
                    <br />
                    先做几道题，系统会自动找出薄弱点。
                  </>
                )}
              </div>
            </div>
            <Link to="/wrong" className="home-weak-visual wrongbook-visual" aria-label="进入错题本">
              <span className="wrongbook-symbol-icon">错</span>
              <span className="wrongbook-symbol-title">错题本</span>
            </Link>
          </div>
          <button
            className="home-action-btn"
            onClick={() =>
              hasWeak
                ? nav(`/quiz/${weak.id}`, { state: { placementId: weak.placementId, topicTitle: weak.title } })
                : nav('/grades')
            }
          >
            {hasWeak ? '针对性练习' : '开始练习'}
          </button>
        </div>
      </section>
    </div>
  );
}
