import { Routes, Route, NavLink, Link } from 'react-router-dom';
import Home from './pages/Home.jsx';
import GradeSelect from './pages/GradeSelect.jsx';
import TopicSelect from './pages/TopicSelect.jsx';
import Quiz from './pages/Quiz.jsx';
import WrongBook from './pages/WrongBook.jsx';
import Progress from './pages/Progress.jsx';
import Interactive from './pages/Interactive.jsx';
import InteractiveDemo from './pages/InteractiveDemo.jsx';

function TopBar() {
  return (
    <header className="topbar">
      <Link to="/" className="brand">
        <span className="logo">π</span>
        <span>数学小课堂</span>
      </Link>
      <span className="spacer" />
      <NavLink to="/interactive" className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
        互动课件
      </NavLink>
      <NavLink to="/grades" className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
        练习
      </NavLink>
      <NavLink to="/wrong" className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
        错题本
      </NavLink>
      <NavLink to="/progress" className={({ isActive }) => 'navlink' + (isActive ? ' active' : '')}>
        进度
      </NavLink>
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
          <Route path="/grades" element={<GradeSelect />} />
          <Route path="/grade/:grade" element={<TopicSelect />} />
          <Route path="/quiz/:topicId" element={<Quiz />} />
          <Route path="/wrong" element={<WrongBook />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>
    </div>
  );
}
