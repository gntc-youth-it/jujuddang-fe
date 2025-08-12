import React, { useState, useEffect } from 'react';
import './TeamSetupModal.css';

interface TeamSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamSet: (teamNumber: number) => void;
}

const TeamSetupModal: React.FC<TeamSetupModalProps> = ({ isOpen, onClose, onTeamSet }) => {
  const [teamNumber, setTeamNumber] = useState<number>(1);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setError('');
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setTeamNumber(value);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (teamNumber < 1 || teamNumber > 60) {
      setError('조 번호는 1부터 60까지 입력 가능합니다.');
      return;
    }
    
    onTeamSet(teamNumber);
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
              value={teamNumber}
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