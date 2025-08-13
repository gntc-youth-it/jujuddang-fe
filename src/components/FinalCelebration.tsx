import React, { useEffect, useRef, useState } from 'react';

const LETTERS = ['가', '나', '안', '입', '성'];

const FinalCelebration: React.FC = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<HeartParticle[]>([]);

  class HeartParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    alpha: number;
    decay: number;
    rotation: number;
    gravity: number;
    friction: number;
    constructor(x: number, y: number, angle: number, color: string) {
      this.x = x;
      this.y = y;
      const speed = Math.random() * 3 + 1.2; // slower initial speed
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.012 + 0.008;
      this.rotation = angle; // static rotation for heart orientation
      this.gravity = 0.05; // gentle gravity
      this.friction = 0.985; // slight air resistance
    }
    update() {
      this.vx *= this.friction;
      this.vy = this.vy * this.friction + this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x - size, y - size, x - size * 1.5, y + size / 2, x, y + size);
      ctx.bezierCurveTo(x + size * 1.5, y + size / 2, x + size, y - size, x, y);
      ctx.closePath();
      ctx.fill();
    }
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      this.drawHeart(ctx, 0, 0, 10);
      ctx.restore();
    }
  }

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

  // Fireworks-only canvas effect (random bursts across the screen)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = particlesRef.current;

    const explode = (x: number, y: number) => {
      const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
      for (let i = 0; i < 50; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push(new HeartParticle(x, y, angle, color));
      }
    };

    let rafId = 0;
    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      // clear frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // draw/update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) particles.splice(i, 1);
      }
    };
    animate();

    const intervalId = window.setInterval(() => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.6 + canvas.height * 0.1; // avoid too bottom/top
      explode(x, y);
    }, 800);

    return () => {
      window.removeEventListener('resize', resize);
      window.clearInterval(intervalId);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="final-screen">
      <canvas
        ref={canvasRef}
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 0 }}
      />
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

      {/* confetti 제거, 불꽃놀이만 사용 */}
    </div>
  );
};

export default FinalCelebration;


