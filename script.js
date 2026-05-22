/**
 * Cloasta Pro Access — Download & Confetti Script
 */
(function () {
  'use strict';

  const DOWNLOAD_URL = 'Cloasta-extention.zip';
  const AUTO_DOWNLOAD_DELAY = 1500; // ms after page load

  // --- Status Element ---
  const statusEl = document.getElementById('download-status');

  function setStatus(text, active = false) {
    if (!statusEl) return;
    statusEl.textContent = text;
    statusEl.classList.toggle('active', active);
  }

  // --- Trigger Download ---
  function triggerDownload() {
    const a = document.createElement('a');
    a.href = DOWNLOAD_URL;
    a.download = 'Cloasta-extention.zip';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setStatus('✓ Download started', true);
  }

  // --- Auto-download on page load ---
  window.addEventListener('load', () => {
    setStatus('Preparing your download…');
    setTimeout(() => {
      triggerDownload();
    }, AUTO_DOWNLOAD_DELAY);
  });

  // --- Manual download button ---
  const downloadBtn = document.getElementById('btn-download');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerDownload();
    });
  }

  // --- Lightweight Confetti ---
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];
    const PARTICLE_COUNT = 80;
    const COLORS = ['#a78bfa', '#818cf8', '#c4b5fd', '#34d399', '#fbbf24', '#f472b6', '#38bdf8'];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function randomRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createParticle() {
      return {
        x: randomRange(0, W),
        y: randomRange(-H, -10),
        w: randomRange(6, 10),
        h: randomRange(4, 7),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: randomRange(0, 360),
        rotationSpeed: randomRange(-6, 6),
        speedX: randomRange(-1.5, 1.5),
        speedY: randomRange(2, 5),
        opacity: 1,
        decay: randomRange(0.003, 0.008),
      };
    }

    function initConfetti() {
      resize();
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = createParticle();
        p.y = randomRange(-H * 0.5, H * 0.3);
        particles.push(p);
      }
      requestAnimationFrame(animateConfetti);
    }

    function animateConfetti() {
      ctx.clearRect(0, 0, W, H);
      let alive = false;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        if (p.opacity <= 0 || p.y > H + 20) {
          particles.splice(i, 1);
          continue;
        }

        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }

      if (alive) {
        requestAnimationFrame(animateConfetti);
      } else {
        canvas.style.display = 'none';
      }
    }

    window.addEventListener('resize', resize);

    // Launch confetti shortly after page loads
    setTimeout(initConfetti, 400);
  }
})();
