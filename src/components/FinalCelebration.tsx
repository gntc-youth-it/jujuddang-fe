import React, { useEffect, useMemo, useState } from 'react';

const LETTERS = ['가', '나', '안', '입', '성'];

const FinalCelebration: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  
  const confettiParticles = useMemo(() => {
    const colors = ['#ffb3b3', '#ffc7a6', '#ffd6a6', '#ff9e9e', '#ffc0cb'];
    return Array.from({ length: 42 }).map((_, i) => {
      const left = Math.random() * 100; // 0 ~ 100%
      const delay = Math.random() * 2.2; // 0 ~ 2.2s
      const duration = 2.2 + Math.random() * 2.4; // 2.2s ~ 4.6s
      const width = 6 + Math.random() * 5; // 6 ~ 11px
      const height = 10 + Math.random() * 8; // 10 ~ 18px
      const drift = (Math.random() - 0.5) * 80; // -40 ~ 40px
      const rotate = Math.floor(Math.random() * 360);
      const color = colors[Math.floor(Math.random() * colors.length)];
      return { key: i, left, delay, duration, width, height, drift, rotate, color };
    });
  }, []);

  const fireworks = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => {
      const x = 10 + Math.random() * 80; // 10% ~ 90%
      const y = 10 + Math.random() * 55; // 10% ~ 65%
      const delay = 0.6 + Math.random() * 2.4; // 0.6s ~ 3s
      const duration = 1.6 + Math.random() * 1.6; // 1.6s ~ 3.2s
      const scale = 0.6 + Math.random() * 0.9; // 0.6 ~ 1.5
      return { key: i, x, y, delay, duration, scale };
    });
  }, []);

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
        {confettiParticles.map(p => (
          <div
            key={p.key}
            className="confetti"
            style={{
              left: `${p.left}%`,
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              transform: `rotate(${p.rotate}deg)`,
              // custom variable for horizontal drift
              // @ts-ignore
              '--driftX': `${p.drift}px`
            }}
          />
        ))}
      </div>

      <div className="fireworks-container">
        {fireworks.map(fw => (
          <div
            key={fw.key}
            className="firework"
            style={{
              left: `${fw.x}%`,
              top: `${fw.y}%`,
              animationDelay: `${fw.delay}s`,
              animationDuration: `${fw.duration}s`,
              // @ts-ignore
              '--fw-scale': fw.scale
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FinalCelebration;


