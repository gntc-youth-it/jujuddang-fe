import React, { useState } from 'react';
import { useTeam } from '../hooks/useTeam';

const Opening: React.FC = () => {
  const { teamNumber, isLoading, hasTeam } = useTeam();
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [nextSite, setNextSite] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  
  const siteLabelMap: Record<string, string> = {
    OPENING: '오프닝장소',
    BAPTISTRY: '침례장',
    FIELD: '대운동장',
    MAIN_3F: '본관 3층 숙소',
    MAIN_4F: '본관 4층 숙소',
    BETHLEHEM: '베들레헴 성전',
    JERUSALEM: '예루살렘 성전',
  };
  
  const resolvedSiteLabel = nextSite ? (siteLabelMap as any)[nextSite] ?? null : null;

  const handleSubmit = async () => {
    const trimmed = answer.trim();
    if (trimmed !== '122') {
      alert('정답이 아닙니다. 다시 입력해주세요.');
      return;
    }
    if (!hasTeam || teamNumber == null) {
      alert('팀 번호를 먼저 설정해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setApiError(null);
      setNextSite(null);

      const response = await fetch('https://api.gntc-youth.com/api/checkpoint/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamNumber, stage: 'OPENING' })
      });

      if (!response.ok) {
        throw new Error('요청에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }

      type ScanResponse = {
        correct: boolean;
        expectedStage: string;
        expectedSite: string;
        nextStage: string;
        nextSite: string;
        progress: number;
        finished: boolean;
      };

      const data: ScanResponse = await response.json();
      if (!data.correct) {
        setInfoMessage('현재 올바른 단계가 아닙니다! 적절한 장소로 이동해주세요');
        setInfoOpen(true);
        return;
      }
      setNextSite(data.nextSite || null);
    } catch (err: any) {
      setApiError(err?.message ?? '알 수 없는 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
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
        {infoOpen && (
          <div style={{
            margin: '0 0 1rem 0',
            padding: '0.75rem 1rem',
            background: 'rgba(75,0,0,0.08)',
            border: '1px solid rgba(75,0,0,0.25)',
            borderRadius: 12,
            color: '#4b0000',
            fontWeight: 600
          }}>
            {infoMessage}
            <button
              onClick={() => setInfoOpen(false)}
              style={{
                marginLeft: 12,
                padding: '0.25rem 0.75rem',
                border: 'none',
                borderRadius: 8,
                background: '#4b0000',
                color: '#fff',
                cursor: 'pointer'
              }}
            >
              닫기
            </button>
          </div>
        )}
        {resolvedSiteLabel ? (
          <>
            <h1>{resolvedSiteLabel}</h1>
            <p style={{ marginTop: '1rem' }}>스텝에게 이 화면을 보여준 후 이동하세요</p>
          </>
        ) : (
          <>
            <p>답을 입력하세요</p>
            <div className="input-answer">
              <textarea 
                className="answer-box"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="여기에 답을 입력하세요..."
              ></textarea>
              <button 
                className="submit-button"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? '확인 중...' : '확인'}
              </button>
            </div>
            {apiError && (
              <p style={{ color: '#b00020', marginTop: '1rem' }}>{apiError}</p>
            )}
          </>
        )}
        <div className="copyright">
          <span>gntc-youth-it</span>
        </div>
      </div>
    </div>
  );
};

export default Opening; 