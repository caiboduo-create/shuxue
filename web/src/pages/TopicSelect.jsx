import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';

const primaryGradeNames = ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'];
const middleGradeNames = ['初一', '初二', '初三'];
const gradeLabel = (g) =>
  g <= 6 ? primaryGradeNames[g - 1] || `${g}年级` : middleGradeNames[g - 7] || `初${g - 6}`;

export default function TopicSelect() {
  const { grade } = useParams();
  const [curriculum, setCurriculum] = useState({ books: [] });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .curriculum(grade)
      .then((d) => setCurriculum(d))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [grade]);

  const books = curriculum.books || [];
  const totalAvailable = books.reduce((sum, book) => sum + (book.availableCount || 0), 0);

  function openTopic(topic) {
    nav(`/learn/${topic.id}`, {
      state: {
        backTo: `/grade/${grade}`,
        backLabel: '返回知识点',
        placementId: topic.placementId,
        topicTitle: topic.title,
        topicObjective: topic.objective,
        curriculumLabel: `${topic.bookTitle} · 第${topic.unit}单元 ${topic.unitTitle}`,
      },
    });
  }

  return (
    <div>
      <Link to="/grades" className="back">返回年级</Link>
      <section className="page-panel orange mt12">
        <div className="panel-head">
          <div>
            <h2>{gradeLabel(Number(grade))}知识点</h2>
            <p className="panel-sub">按人教版教材上下册和单元拆开，先选课本位置，再进入学习页。</p>
          </div>
          {!loading && !err && <span className="badge green">已接入 {totalAvailable} 个</span>}
        </div>

        {loading && (
          <div className="row mt16">
            <span className="spinner" /> <span className="muted">加载中…</span>
          </div>
        )}
        {err && <div className="empty">加载失败：{err}</div>}

        {!loading && !err && books.length === 0 && (
          <div className="empty">
            这个年级的知识点还在补充中 🛠️
            <br />
            <span className="muted">可以先试试相邻年级，或看 README 了解如何添加知识点。</span>
          </div>
        )}

        {books.map((book) => (
          <section key={book.id} className="textbook-book">
            <div className="textbook-book-head">
              <div>
                <span className="badge">{book.volumeLabel}</span>
                <h3>{book.title}</h3>
              </div>
              <span className="textbook-count">{book.availableCount} 个已接入</span>
            </div>

            <div className="textbook-units">
              {book.units.map((unit) => {
                const ready = unit.topics.length > 0;
                return (
                  <article key={`${book.id}-${unit.unit}`} className={`unit-card ${ready ? 'ready' : 'pending'}`}>
                    <div className="unit-topline">
                      <span className="unit-index">第 {unit.unit} 单元</span>
                      <span className={`unit-state ${ready ? 'ready' : ''}`}>{ready ? '可练习' : '待接入'}</span>
                    </div>
                    <div className="unit-title">{unit.title}</div>

                    {ready ? (
                      <div className="unit-topic-list">
                        {unit.topics.map((topic) => (
                          <button
                            key={topic.placementId}
                            data-placement-id={topic.placementId}
                            className="unit-topic-btn"
                            onClick={() => openTopic(topic)}
                          >
                            <span className="unit-topic-main">{topic.title}</span>
                            <span className="unit-topic-meta">{topic.category}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="unit-empty">目录已整理，题库待补充</div>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </section>
    </div>
  );
}
