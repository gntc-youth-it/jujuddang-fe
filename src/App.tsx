import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 페이지 컴포넌트들 import
import Opening from './pages/Opening';
import Jericho from './pages/Jericho';
import RedSea from './pages/RedSea';
import Decalogue from './pages/Decalogue';
import TeamSetupModal from './components/TeamSetupModal';

function App() {
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<number | null>(null);

  useEffect(() => {
    // localStorage에서 팀 번호 확인
    const savedTeam = localStorage.getItem('teamNumber');
    if (savedTeam) {
      setCurrentTeam(parseInt(savedTeam));
    } else {
      // 팀 번호가 없으면 모달 표시
      setShowTeamModal(true);
    }
  }, []);

  const handleTeamSet = (teamNumber: number) => {
    localStorage.setItem('teamNumber', teamNumber.toString());
    setCurrentTeam(teamNumber);
    setShowTeamModal(false);
  };

  const handleCloseModal = () => {
    setShowTeamModal(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navigation">
          <ul>
            <li><Link to="/opening">Opening</Link></li>
            <li><Link to="/jericho">Jericho</Link></li>
            <li><Link to="/red-sea">Red Sea</Link></li>
            <li><Link to="/decalogue">Decalogue</Link></li>
          </ul>
          {currentTeam && (
            <div className="team-info">
              <span>현재 팀: {currentTeam}조</span>
              <button 
                onClick={() => setShowTeamModal(true)}
                className="change-team-btn"
              >
                팀 변경
              </button>
            </div>
          )}
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/opening" element={<Opening />} />
            <Route path="/jericho" element={<Jericho />} />
            <Route path="/red-sea" element={<RedSea />} />
            <Route path="/decalogue" element={<Decalogue />} />
            <Route path="/" element={<Opening />} />
          </Routes>
        </main>

        <TeamSetupModal
          isOpen={showTeamModal}
          onClose={handleCloseModal}
          onTeamSet={handleTeamSet}
        />
      </div>
    </Router>
  );
}

export default App;
