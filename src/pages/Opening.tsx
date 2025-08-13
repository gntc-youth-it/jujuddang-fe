import React, { useState } from 'react';
import { useTeam } from '../hooks/useTeam';

const Opening: React.FC = () => {
  const { teamNumber, isLoading, hasTeam } = useTeam();
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    // 답변 제출 로직을 여기에 구현할 수 있습니다
    console.log('제출된 답변:', answer);
    alert('답변이 제출되었습니다!');
  };

  if (isLoading) {
    return (
      <div className="opening-page w-100 h-100">
        <div className="container w-100 h-100">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="answer-page w-100 h-100">
      <div className="container w-100 h-100">
        <h1>주님이 주신 땅으로</h1>
        <p>답을 입력하세요</p>
        <div className="input-answer">
          <textarea 
            className="answer-box"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="여기에 답변을 입력하세요..."
          ></textarea>
          <button 
            className="submit-button"
            onClick={handleSubmit}
          >
            확인
          </button>
        </div>
        <div className="copyright">
          <span>gntc-youth-it</span>
        </div>
      </div>
    </div>
  );
};

export default Opening; 