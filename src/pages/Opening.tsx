import React from 'react';
import { useTeam } from '../hooks/useTeam';

const Opening: React.FC = () => {
  const { teamNumber, isLoading, hasTeam } = useTeam();

  if (isLoading) {
    return (
      <div className="opening-page">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="opening-page">
      <h1>Opening</h1>
      <p>이벤트 오프닝 페이지입니다.</p>
      {hasTeam && (
        <div className="team-welcome">
          <h2>안녕하세요, {teamNumber}조!</h2>
          <p>이벤트에 참여해주셔서 감사합니다.</p>
        </div>
      )}
    </div>
  );
};

export default Opening; 