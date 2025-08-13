import React, { useState, useEffect } from 'react';
import './TeamSetupModal.css';

interface TeamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamSet: (teamNumber: number) => void;
}

const TeamSetupModal: React.FC<TeamSetupModalProps> = ({ isOpen, onClose, onTeamSet }) => {
  const [teamNumberInput, setTeamNumberInput] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setError('');
      // 입력 초기화 (비워두기)
      setTeamNumberInput('');
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // 빈 값 허용, 숫자만 유지
    if (value === '') {
      setTeamNumberInput('');
      setError('');
      return;
    }
    setTeamNumberInput(value);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(teamNumberInput, 10);
    if (Number.isNaN(parsed)) {
      setError('조 번호를 입력해주세요.');
      return;
    }
    if (parsed < 1 || parsed > 60) {
      setError('조 번호는 1부터 60까지 입력 가능합니다.');
      return;
    }

    onTeamSet(parsed);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>조 번호 설정</h2>
        <p>본인이 속한 조 번호를 입력해주세요. (1~60조)</p>
        
        <form onSubmit={handleSubmit}>
          <div className="team-input-container">
            <label htmlFor="teamNumber" className="team-input-label">
              조 번호:
            </label>
            <input
              id="teamNumber"
              type="number"
              min="1"
              max="60"
              value={teamNumberInput}
              onChange={handleInputChange}
              className="team-input"
              placeholder="1~60"
              autoFocus
            />
            <span className="team-suffix">조</span>
          </div>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="modal-actions">
            <button type="submit" className="confirm-btn">
              확인
            </button>
            <button type="button" className="cancel-btn" onClick={handleClose}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamSetupModal; 