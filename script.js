// ==========================================
// ១. ប្រព័ន្ធបាញ់កាំជ្រួចលើអេក្រង់ (Canvas Fireworks)
// ==========================================
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const fireworks = [];

class Firework {
  constructor(x, y, targetX, targetY, color) {
    this.x = x;
    this.y = y;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.speed = 3.5;
    this.angle = Math.atan2(targetY - y, targetX - x);
    this.distanceToTarget = Math.hypot(targetX - x, targetY - y);
    this.distanceTraveled = 0;
  }

  update(index) {
    const vx = Math.cos(this.angle) * this.speed * 2.5;
    const vy = Math.sin(this.angle) * this.speed * 2.5;
    this.x += vx;
    this.y += vy;
    this.distanceTraveled = Math.hypot(vx, vy) + this.distanceTraveled;

    if (this.distanceTraveled >= this.distanceToTarget) {
      createParticles(this.targetX, this.targetY, this.color);
      fireworks.splice(index, 1);
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 5 + 1;
    this.friction = 0.96;
    this.gravity = 0.08;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.01;
  }

  update(index) {
    this.speed *= this.friction;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;
    this.alpha -= this.decay;

    if (this.alpha <= 0) {
      particles.splice(index, 1);
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function createParticles(x, y, color) {
  const count = 45;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
}

const colors = ['#ff4081', '#ffd700', '#00e5ff', '#ff1744', '#76ff03', '#e040fb', '#ff9100'];

function launchRandomFirework() {
  const startX = Math.random() * canvas.width;
  const startY = canvas.height;
  const targetX = Math.random() * (canvas.width - 200) + 100;
  const targetY = Math.random() * (canvas.height * 0.5) + 80;
  const color = colors[Math.floor(Math.random() * colors.length)];
  fireworks.push(new Firework(startX, startY, targetX, targetY, color));
}

function loopFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].draw();
    fireworks[i].update(i);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].draw();
    particles[i].update(i);
  }

  requestAnimationFrame(loopFireworks);
}
loopFireworks();

// បាញ់កាំជ្រួចស្វ័យប្រវត្តិតាមចន្លោះពេល
setInterval(launchRandomFirework, 1500);

// ចុចលើអេក្រង់ត្រង់ណាក៏បាញ់កាំជ្រួចត្រង់នោះបាន
window.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON' && !e.target.closest('.envelope-interactive-box') && !e.target.closest('.letter-modal-content')) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    fireworks.push(new Firework(e.clientX, canvas.height, e.clientX, e.clientY, color));
  }
});

// ==========================================
// ២. មុខងារចាក់/បិទភ្លេង
// ==========================================
function toggleMusic() {
  const music = document.getElementById('bgMusic');
  const icon = document.getElementById('musicIcon');
  const text = document.getElementById('musicText');

  if (music.paused) {
    music.play().then(() => {
      icon.innerText = "⏸️";
      text.innerText = "ផ្អាកភ្លេង";
    }).catch(() => {});
  } else {
    music.pause();
    icon.innerText = "🎵";
    text.innerText = "ចាក់ភ្លេង";
  }
}

// ==========================================
// ៣. មុខងារផ្លុំទៀន (Blow Candles Animation)
// ==========================================
let candlesBlown = false;

function blowCandles() {
  if (candlesBlown) return;

  document.getElementById('flame1').style.opacity = '0';
  document.getElementById('flame2').style.opacity = '0';
  document.getElementById('flame3').style.opacity = '0';

  document.getElementById('smoke1').innerText = "💨";
  document.getElementById('smoke2').innerText = "💨";
  document.getElementById('smoke3').innerText = "💨";
  document.getElementById('smoke1').style.opacity = '1';
  document.getElementById('smoke2').style.opacity = '1';
  document.getElementById('smoke3').style.opacity = '1';

  document.getElementById('wishSuccessText').style.display = 'block';
  document.getElementById('blowBtn').innerText = "✨ បានផ្លុំទៀនរួចរាល់ ✨";
  document.getElementById('blowBtn').style.background = "#8e8e8e";

  candlesBlown = true;

  // បាញ់កាំជ្រួចផ្ទួនៗ និង Confetti
  for (let i = 0; i < 5; i++) {
    setTimeout(launchRandomFirework, i * 200);
  }
  confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
  toggleMusic();
}

// ==========================================
// ៤. មុខងារបើក/បិទសំបុត្រស្នេហ៍ (Open Romantic Letter)
// ==========================================
function openRomanticLetter() {
  const envBox = document.getElementById('envelopeBox');
  const modal = document.getElementById('letterModalOverlay');

  envBox.classList.add('opening');

  confetti({
    particleCount: 130,
    spread: 80,
    origin: { y: 0.6 }
  });

  if (typeof launchRandomFirework === 'function') {
    launchRandomFirework();
    setTimeout(launchRandomFirework, 250);
  }

  setTimeout(() => {
    modal.style.display = 'flex';
  }, 400);
}

function closeRomanticLetter() {
  const envBox = document.getElementById('envelopeBox');
  const modal = document.getElementById('letterModalOverlay');
  
  modal.style.display = 'none';
  envBox.classList.remove('opening');
}

function closeOnBackdrop(event) {
  if (event.target.id === 'letterModalOverlay') {
    closeRomanticLetter();
  }
}

function sendLoveHearts() {
  confetti({
    particleCount: 100,
    spread: 120,
    origin: { y: 0.6 },
    colors: ['#ff4081', '#ff1744', '#f50057', '#ffd700']
  });

  if (typeof launchRandomFirework === 'function') {
    launchRandomFirework();
    setTimeout(launchRandomFirework, 300);
  }
  
  alert("💖 បងស្រលាញ់អូន ធី កញ្ញារ៉ា ខ្លាំងណាស់! រីករាយថ្ងៃកំណើតណា៎អូនសម្លាញ់! 🌹🥰");
}

// ==========================================
// ៥. នាឡិការាប់ថយក្រោយ ទៅកាន់ ២៣ តុលា ២០២៦
// ==========================================
const targetDate = new Date('2026-10-23T00:00:00+07:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff > 0) {
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d < 10 ? '0' + d : d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();