import { Routes, Route, NavLink, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import GradeSelect from './pages/GradeSelect.jsx';
import TopicSelect from './pages/TopicSelect.jsx';
import Quiz from './pages/Quiz.jsx';
import WrongBook from './pages/WrongBook.jsx';
import Progress from './pages/Progress.jsx';
import Interactive from './pages/Interactive.jsx';
import InteractiveDemo from './pages/InteractiveDemo.jsx';
import TopicLearn from './pages/TopicLearn.jsx';
import PhotoSolve from './pages/PhotoSolve.jsx';

const navItems = [
  { to: '/photo-solve', label: 'AI拍照答题', icon: '拍', tone: 'pink' },
  { to: '/progress', label: '学习进度', icon: '↗', tone: 'green' },
];

function TopBar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="logo">π</span>
        <span>数学小课堂</span>
      </Link>
      <span className="spacer" />
      <nav className="topnav" aria-label="主导航">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `navlink nav-${item.tone}${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <div className="app">
      <TopBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interactive" element={<Interactive />} />
          <Route path="/interactive/:demoId" element={<InteractiveDemo />} />
          <Route path="/photo-solve" element={<PhotoSolve />} />
          <Route path="/grades" element={<GradeSelect />} />
          <Route path="/grade/:grade" element={<TopicSelect />} />
          <Route path="/learn/:topicId" element={<TopicLearn />} />
          <Route path="/quiz/:topicId" element={<Quiz />} />
          <Route path="/wrong" element={<WrongBook />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
    </div>
  );
}
