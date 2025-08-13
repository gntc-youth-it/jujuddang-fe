import React, { useEffect, useState } from 'react';

const LETTERS = ['가', '나', '안', '입', '성'];

const FinalCelebration: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    let index = 0;
    const tick = () => {
      if (!mounted) return;
      setVisibleCount((prev) => Math.min(prev + 1, LETTERS.length));
      index += 1;
      if (index < LETTERS.length) {
        setTimeout(tick, 350);
      }
    };
    setTimeout(tick, 200);
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="final-screen">
      <div className="canaan-letters">
        {LETTERS.map((ch, i) => (
          <span key={i} className={`canaan-letter ${i < visibleCount ? 'visible' : ''}`}>{ch}</span>
        ))}
      </div>

      <div className="final-destination">바울성전</div>

      <div className="final-instructions">
        <p>• 스텝에게 화면을 보여주고 이동하세요</p>
        <p>• 안디옥성전에 조원들과 추억을 남길 수 있는 은진네컷이 준비되어있습니다!</p>
      </div>

      <div className="confetti-container">
        {Array.from({ length: 14 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{ left: `${(i + 1) * (100 / 16)}%`, animationDelay: `${(i % 7) * 0.3}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default FinalCelebration;


