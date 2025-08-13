import React, { useState, useRef } from 'react';
import { useTeam } from '../hooks/useTeam';
import FinalCelebration from '../components/FinalCelebration';

const Opening: React.FC = () => {
  const { teamNumber, isLoading, hasTeam } = useTeam();
  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [nextSite, setNextSite] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2500);
  };
  
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
      showToast('정답이 아닙니다. 다시 입력해주세요.');
      return;
    }
    const storedTeamStr = localStorage.getItem('teamNumber');
    const payloadTeamNumber = storedTeamStr ? parseInt(storedTeamStr) : NaN;
    if (Number.isNaN(payloadTeamNumber)) {
      showToast('팀 번호를 먼저 설정해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setApiError(null);
      setNextSite(null);

      const response = await fetch('https://api.gntc-youth.com/api/checkpoint/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamNumber: payloadTeamNumber, stage: 'OPENING' })
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
        showToast('현재 올바른 단계가 아닙니다! 적절한 장소로 이동해주세요');
        return;
      }
      if (data.finished) {
        setNextSite('FINISHED');
      } else {
        setNextSite(data.nextSite || null);
      }
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
        {toastMessage && (
          <div style={{
            position: 'fixed',
            top: '70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(75,0,0,0.95)',
            color: '#fff',
            padding: '0.6rem 1rem',
            borderRadius: 10,
            zIndex: 9999,
            boxShadow: '0 6px 18px rgba(75,0,0,0.35)',
            fontWeight: 600
          }}>
            {toastMessage}
          </div>
        )}
        {nextSite === 'FINISHED' ? (
          <>
            <FinalCelebration />
          </>
        ) : resolvedSiteLabel ? (
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