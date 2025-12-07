const canvas = document.getElementById('binaryCanvas');
const ctx = canvas.getContext('2d');

// Base setup
let fontSize = 16; // keep size unchanged
let letters = '01';
let columns, drops;

function setup() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Classic column count (no spacing hacks)
  columns = Math.floor(canvas.width / fontSize);

  // Start drops at random vertical positions (no obvious "starting ones")
  drops = Array(columns).fill().map(() =>
    Math.floor(Math.random() * canvas.height / fontSize)
  );

  ctx.font = fontSize + 'px monospace';
  ctx.textBaseline = 'top';
}
setup();

// Mouse glow
let mouseX = -1000;
let mouseY = -1000;
const glowRadius = 60; // slightly larger glow for neon vibe

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mouseleave', () => {
  mouseX = -1000;
  mouseY = -1000;
});

window.addEventListener('resize', setup);

// Draw loop
function draw() {
  // Softer trail for brighter overall look
  ctx.fillStyle = 'rgba(0, 20, 0, 0.12)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const x = i * fontSize;
    const y = drops[i] * fontSize;
    const text = letters[Math.floor(Math.random() * letters.length)];

    // Glow intensity based on distance to mouse
    const dx = x - mouseX;
    const dy = y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let intensity = Math.max(0, 1 - dist / glowRadius);
    intensity = Math.pow(intensity, 2); // soft edge

    // Brighter baseline with neon peak
    const base = 140; // baseline green
    const greenValue = Math.floor(base + intensity * (255 - base));
    ctx.fillStyle = `rgb(0, ${greenValue}, 0)`;

    ctx.fillText(text, x, y);

    // Slower, smoother fall
    drops[i] += 0.4;

    // Reset drops occasionally after bottom
    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
  }
}

// Classic slower cadence
setInterval(draw, 80);

// ===== Credits Fade-In =====
const credits = document.querySelector('.credits-section');
if (credits && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          credits.classList.add('visible');
          io.disconnect();
        }
      });
    },
    { threshold: 0.2 }
  );
  io.observe(credits);
} else if (credits) {
  window.addEventListener('scroll', () => {
    const rect = credits.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
      credits.classList.add('visible');
    }
  });
}
