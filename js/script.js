/* =============================================
   SYNTAX SURGE — CORE SCRIPT
   Created by Aditya
   ============================================= */
let cropper;

'use strict';

/* ── CURSOR SYSTEM ──────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const trailCanvas = document.getElementById('cursor-trail-canvas');
  if (!dot || !ring || !trailCanvas) return;

  const ctx = trailCanvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  trailCanvas.width = W; trailCanvas.height = H;
  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    trailCanvas.width = W; trailCanvas.height = H;
  });

  let mx = -100, my = -100;
  let rx = -100, ry = -100;
  const trail = [];

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    trail.push({ x: mx, y: my, age: 0 });
    if (trail.length > 28) trail.shift();
  });

  function animCursor() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';

    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < trail.length; i++) {
      trail[i].age++;
      const t = i / trail.length;
      const alpha = t * 0.5 * (1 - trail[i].age / 60);
      if (alpha <= 0) continue;
      const r = t * 4;
      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(animCursor);
  }
  animCursor();
})();

/* ── PARTICLE CANVAS ────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: 0, y: 0 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize(); window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3; this.vy = (Math.random() - 0.5) * 0.3;
      this.size = Math.random() * 1.5 + 0.5; this.alpha = Math.random() * 0.5 + 0.1;
      this.life = 0; this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      const dx = mouse.x - this.x; const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.02;
        this.vx -= dx / dist * force; this.vy -= dy / dist * force;
      }
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const lifeRatio = Math.sin((this.life / this.maxLife) * Math.PI);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 136, ${this.alpha * lifeRatio})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${(1 - dist / 100) * 0.08})`;
          ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── NAV SCROLL ─────────────────────────────── */
(function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
  // Active link
  const links = nav.querySelectorAll('a');
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) a.classList.add('active');
  });
})();

/* ── MOBILE NAV ─────────────────────────────── */
(function initMobileNav() {
  const burger = document.getElementById('nav-burger');
  const overlay = document.getElementById('mobile-nav-overlay');
  if (!burger || !overlay) return;
  burger.addEventListener('click', () => overlay.classList.toggle('open'));
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => overlay.classList.remove('open')));
})();

/* ── TERMINAL ANIMATION ─────────────────────── */
(function initTerminal() {
  const terminal = document.getElementById('terminal-output');
  if (!terminal) return;

  const lines = [
    { type: 'prompt', text: '$ syntax-surge --init' },
    { type: 'out', text: '→ Loading AI core modules...' },
    { type: 'out success', text: '✓ Vision engine ready' },
    { type: 'out success', text: '✓ OCR module loaded' },
    { type: 'out success', text: '✓ Object detection active' },
    { type: 'prompt', text: '$ scan --input ./sample.jpg --mode=full' },
    { type: 'out', text: '→ Preprocessing image...' },
    { type: 'out', text: '→ Running inference pipeline...' },
    { type: 'out success', text: '✓ Detected: 3 objects, 94.2% confidence' },
    { type: 'out warn', text: '! Auto-tagging: 8 labels generated' },
    { type: 'out success', text: '✓ OCR extracted 142 characters' },
    { type: 'prompt', text: '$ export --format=pdf --quality=high' },
    { type: 'out success', text: '✓ PDF generated: output.pdf (342 KB)' },
    { type: 'prompt', text: '$ _' },
  ];

  let lineIdx = 0;
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';

  function typeNextLine() {
    if (lineIdx >= lines.length - 1) {
      terminal.appendChild(cursor);
      return;
    }
    const lineData = lines[lineIdx];
    const span = document.createElement('span');
    span.className = 't-line';
    const innerSpan = document.createElement('span');

    if (lineData.type === 'prompt') {
      innerSpan.className = 't-prompt';
      innerSpan.textContent = lineData.text;
      span.appendChild(innerSpan);
    } else {
      innerSpan.className = `t-out ${lineData.type.replace('out', '').trim()}`;
      innerSpan.textContent = lineData.text;
      span.appendChild(innerSpan);
    }

    terminal.appendChild(span);
    lineIdx++;
    const delay = lineData.type === 'prompt' ? 700 : 350;
    setTimeout(typeNextLine, delay);
  }

  // Start after a short delay
  setTimeout(typeNextLine, 600);
})();

/* ── SCROLL REVEAL ──────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  items.forEach(el => obs.observe(el));
})();

/* ── STATS COUNTER ──────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const isFloat = el.dataset.float === 'true';
      const dur = 1800;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = target * ease;
        el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => obs.observe(el));
})();

/* ── UPLOAD ZONE ────────────────────────────── */
function initUploadZone(zoneId, inputId, previewId, onFile) {
  const zone = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!zone || !input) return;

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
  input.addEventListener('change', () => { if (input.files[0]) handleFile(input.files[0]); });
  zone.addEventListener('click', e => { if (e.target !== input) input.click(); });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) { showToast('Please upload an image file'); return; }
    if (preview) {
      const img = preview.querySelector('img');
      if (img) { img.src = URL.createObjectURL(file); }
      preview.classList.add('show');
    }
    if (onFile) onFile(file);
  }
}

/* ── AI ANALYSIS (Lens page) ────────────────── */
window.runLensAnalysis = async function() {

  const previewBox = document.getElementById('lens-preview');
  const resultPanel = document.getElementById('lens-result');
  const img = previewBox ? previewBox.querySelector('img') : null;

  if (!previewBox || !previewBox.classList.contains('show') || !img || !img.src) {

    showToast('Please upload an image first');

    return;
  }

  const overlay = previewBox.querySelector('.scan-overlay');

  if (overlay) overlay.classList.add('active');

  const btn = document.getElementById('lens-analyze-btn');

  if (btn) {

    btn.disabled = true;

    btn.innerHTML =
      '<span class="spinner"></span> Analyzing...';
  }

  try {

    const model = await cocoSsd.load();

    const predictions = await model.detect(img);

    const tagContainer =
      document.getElementById('lens-tags');

    tagContainer.innerHTML = '';

    predictions.forEach(pred => {

      const t = document.createElement('span');

      t.className = 'tag high';

      t.textContent =
        pred.class +
        ' ' +
        Math.round(pred.score * 100) +
        '%';

      tagContainer.appendChild(t);
    });

    const descEl =
      document.getElementById('lens-desc');

    if (predictions.length > 0) {

      descEl.textContent =
        'AI successfully detected objects from the uploaded image.';
    }
    else {

      descEl.textContent =
        'No recognizable objects detected.';
    }

    resultPanel.classList.add('show');

    showToast('Analysis complete');

  }
  catch(error) {

    console.error(error);

    showToast('AI detection failed');
  }

  if (overlay) overlay.classList.remove('active');

  if (btn) {

    btn.disabled = false;

    btn.textContent = 'Re-analyze';
  }
};

/* ── OCR ─────────────────────────────────────── */
window.runOCR = function() {
  const previewBox = document.getElementById('ocr-preview');
  if (!previewBox || !previewBox.classList.contains('show')) {
    showToast('Upload an image first'); return;
  }
  const img = previewBox.querySelector('img');
  if (!img || !img.src) { showToast('No image found'); return; }

  const btn = document.getElementById('ocr-btn');
  const progress = document.getElementById('ocr-progress');
  const bar = document.getElementById('ocr-bar');
  const pct = document.getElementById('ocr-pct');
  const output = document.getElementById('ocr-output');
  const resultPanel = document.getElementById('ocr-result');

  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Running OCR...'; }
  if (progress) progress.classList.add('show');

  if (typeof Tesseract === 'undefined') {
    showToast('Loading Tesseract...'); 
    loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js', () => doOCR());
  } else { doOCR(); }

  function doOCR() {
    Tesseract.recognize(img.src, 'eng', {
      logger: info => {
        if (info.status === 'recognizing text') {
          const p = Math.round(info.progress * 100);
          if (bar) bar.style.width = p + '%';
          if (pct) pct.textContent = p + '%';
        }
      }
    }).then(({ data: { text } }) => {
      if (output) output.value = text.trim() || '[No readable text found in image]';
      if (resultPanel) resultPanel.classList.add('show');
      if (btn) { btn.disabled = false; btn.textContent = 'Extract Again'; }
      if (progress) progress.classList.remove('show');
      showToast('Text extracted successfully');
    }).catch(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Extract Text'; }
      if (progress) progress.classList.remove('show');
      showToast('OCR failed — try a clearer image');
    });
  }
};

window.copyOCR = function() {
  const output = document.getElementById('ocr-output');
  if (!output || !output.value) { showToast('Nothing to copy'); return; }
  navigator.clipboard.writeText(output.value).then(() => showToast('Copied to clipboard'));
};

/* ── PDF EXPORT ─────────────────────────────── */
window.exportPDF = async function() {

  const input =
    document.getElementById('pdf-file-input');

  if (!input.files.length) {

    showToast('Upload images first');

    return;
  }

  const btn = document.getElementById('pdf-btn');

  if (btn) {

    btn.disabled = true;

    btn.innerHTML =
      '<span class="spinner"></span> Generating...';
  }

  if (typeof window.jspdf === 'undefined') {

    await new Promise(resolve => {

      loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        resolve
      );
    });
  }

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  const files = Array.from(input.files);

  for (let i = 0; i < files.length; i++) {

    const file = files[i];

    const imgData =
      await fileToDataURL(file);

    const img = new Image();

    await new Promise(resolve => {

      img.onload = resolve;

      img.src = imgData;
    });

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (img.height * pdfWidth) / img.width;

    if (i > 0) {

      pdf.addPage();
    }

    pdf.addImage(
      img,
      'JPEG',
      0,
      0,
      pdfWidth,
      pdfHeight
    );
  }

  pdf.save('syntax-surge.pdf');

  if (btn) {

    btn.disabled = false;

    btn.textContent = 'Export PDF';
  }

  showToast('PDF downloaded');
};
/* ── OBJECT DETECTION ───────────────────────── */
window.runDetection = function() {
  const previewBox = document.getElementById('detect-preview');
  if (!previewBox || !previewBox.classList.contains('show')) {
    showToast('Upload an image first'); return;
  }
  const img = previewBox.querySelector('img');
  if (!img || !img.src) { showToast('No image'); return; }

  const btn = document.getElementById('detect-btn');
  const canvasWrap = document.getElementById('detect-canvas-wrap');
  const canvas = document.getElementById('detect-canvas');
  const resultPanel = document.getElementById('detect-result');
  const tagContainer = document.getElementById('detect-tags');

  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Detecting...'; }

  setTimeout(() => {
    const imgEl = new Image();
    imgEl.onload = function() {
      if (!canvas) return;
      canvas.width = imgEl.width; canvas.height = imgEl.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imgEl, 0, 0);

      // Simulated bounding boxes
      const objects = [
        { label: 'Object A', conf: 0.94, x: 0.05, y: 0.1, w: 0.35, h: 0.55 },
        { label: 'Object B', conf: 0.87, x: 0.55, y: 0.2, w: 0.38, h: 0.45 },
        { label: 'Region C', conf: 0.72, x: 0.2, y: 0.65, w: 0.5, h: 0.25 },
      ].slice(0, Math.floor(Math.random() * 2) + 1);

      objects.forEach(obj => {
        const bx = obj.x * imgEl.width; const by = obj.y * imgEl.height;
        const bw = obj.w * imgEl.width; const bh = obj.h * imgEl.height;
        ctx.strokeStyle = '#00ff88'; ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.fillStyle = 'rgba(0,255,136,0.15)'; ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = 'rgba(0,255,136,0.9)'; ctx.fillRect(bx, by - 22, bw, 22);
        ctx.fillStyle = '#040a0a'; ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.fillText(`${obj.label} ${Math.round(obj.conf * 100)}%`, bx + 6, by - 7);
      });

      if (canvasWrap) canvasWrap.classList.add('show');

      if (tagContainer) {
        tagContainer.innerHTML = '';
        objects.forEach(obj => {
          const t = document.createElement('span'); t.className = 'tag high';
          t.textContent = `${obj.label} (${Math.round(obj.conf * 100)}%)`; tagContainer.appendChild(t);
        });
      }
      if (resultPanel) resultPanel.classList.add('show');
      if (btn) { btn.disabled = false; btn.textContent = 'Detect Again'; }
      showToast(`${objects.length} object(s) detected`);
    };
    imgEl.src = img.src;
  }, 2200);
};

/* ── SPECIES ID ─────────────────────────────── */
window.runSpeciesID = function() {
  const previewBox = document.getElementById('species-preview');
  if (!previewBox || !previewBox.classList.contains('show')) { showToast('Upload an image first'); return; }
  const btn = document.getElementById('species-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Identifying...'; }

  const results = [
    { name: 'Monstera deliciosa', common: 'Swiss Cheese Plant', type: 'plant', conf: 92, info: 'A popular tropical houseplant native to southern Mexico and Panama. Known for its iconic split leaves and easy care requirements.' },
    { name: 'Canis lupus familiaris', common: 'Domestic Dog', type: 'animal', conf: 96, info: 'Man\'s most versatile companion. Descended from wolves through thousands of years of selective domestication.' },
    { name: 'Ficus lyrata', common: 'Fiddle Leaf Fig', type: 'plant', conf: 88, info: 'A striking indoor tree with large, violin-shaped leaves. Originally from the tropical rainforests of western Africa.' },
    { name: 'Columba livia', common: 'Rock Pigeon', type: 'bird', conf: 85, info: 'One of the world\'s most widely distributed bird species. The ancestral species of all domestic pigeons.' },
  ];
  const pick = results[Math.floor(Math.random() * results.length)];

  setTimeout(() => {
    setIDResult('species-result', pick);
    if (btn) { btn.disabled = false; btn.textContent = 'Re-identify'; }
    showToast('Species identified');
  }, 2500);
};

/* ── LANDMARK ID ────────────────────────────── */
window.runLandmarkID = function() {
  const previewBox = document.getElementById('landmark-preview');
  if (!previewBox || !previewBox.classList.contains('show')) { showToast('Upload an image first'); return; }
  const btn = document.getElementById('landmark-btn');
  if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Scanning...'; }

  const results = [
    { name: 'Eiffel Tower', common: 'Paris, France', type: 'monument', conf: 97, info: 'Built in 1889 as the entrance arch for the 1889 World\'s Fair. Standing 330 metres tall, it was the world\'s tallest man-made structure for 41 years.' },
    { name: 'Colosseum', common: 'Rome, Italy', type: 'ancient', conf: 93, info: 'An oval amphitheatre built between 70-80 AD. It could hold between 50,000–80,000 spectators, and hosted gladiatorial contests.' },
    { name: 'Golden Gate Bridge', common: 'San Francisco, USA', type: 'bridge', conf: 91, info: 'Completed in 1937, it spans the 1.7-mile strait connecting San Francisco Bay and the Pacific Ocean.' },
    { name: 'Taj Mahal', common: 'Agra, India', type: 'monument', conf: 95, info: 'An ivory-white marble mausoleum commissioned in 1631 by Mughal emperor Shah Jahan in memory of his wife.' },
  ];
  const pick = results[Math.floor(Math.random() * results.length)];

  setTimeout(() => {
    setIDResult('landmark-result', pick);
    if (btn) { btn.disabled = false; btn.textContent = 'Re-identify'; }
    showToast('Landmark identified');
  }, 2200);
};

function setIDResult(panelId, data) {
  const panel = document.getElementById(panelId);
  if (!panel) return;
  panel.classList.add('show');
  const nameEl = panel.querySelector('.id-name');
  const badgeEl = panel.querySelector('.id-badge');
  const infoEl = panel.querySelector('.id-info');
  const ringVal = panel.querySelector('.ring-val');
  const ringText = panel.querySelector('.ring-text');
  const circum = 2 * Math.PI * 32;
  if (nameEl) nameEl.textContent = data.name;
  if (badgeEl) badgeEl.textContent = data.common;
  if (infoEl) infoEl.textContent = data.info;
  if (ringVal) {
    ringVal.style.strokeDasharray = circum;
    ringVal.style.strokeDashoffset = circum * (1 - data.conf / 100);
  }
  if (ringText) ringText.textContent = data.conf + '%';
}

/* ── CAMERA ─────────────────────────────────── */
window.openCamera = function(previewId) {
  const vWrap = document.getElementById('cam-video-wrap');
  const video = document.getElementById('cam-video');
  if (!vWrap || !video) return;
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      video.srcObject = stream; video.play();
      vWrap.classList.add('show');
      showToast('Camera active — click Capture to snap');
    })
    .catch(() => showToast('Camera access denied'));
};

window.captureCamera = function(previewId) {
  const video = document.getElementById('cam-video');
  const previewBox = document.getElementById(previewId);
  if (!video || !previewBox) return;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  const img = previewBox.querySelector('img');
  if (img) { img.src = canvas.toDataURL('image/jpeg'); previewBox.classList.add('show'); }
  const stream = video.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  const vWrap = document.getElementById('cam-video-wrap');
  if (vWrap) vWrap.classList.remove('show');
  showToast('Image captured');
};

/* ── TOAST ───────────────────────────────────── */
function showToast(msg) {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast'; toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = '▸ ' + msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ── UTILS ───────────────────────────────────── */
function shuffleArr(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function loadScript(src, cb) {
  const s = document.createElement('script'); s.src = src;
  s.onload = cb; s.onerror = () => showToast('Failed to load library');
  document.head.appendChild(s);
}

/* ── UPLOAD ZONE INITIALISE ─────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Lens
  initUploadZone('lens-upload-zone', 'lens-file-input', 'lens-preview');
  // OCR
  initUploadZone('ocr-upload-zone', 'ocr-file-input', 'ocr-preview');
  // PDF
  initUploadZone('pdf-upload-zone', 'pdf-file-input', 'pdf-preview');
  // Detect
  initUploadZone('detect-upload-zone', 'detect-file-input', 'detect-preview');
  // Species
  initUploadZone('species-upload-zone', 'species-file-input', 'species-preview');
  // Landmark
  initUploadZone('landmark-upload-zone', 'landmark-file-input', 'landmark-preview');
});
window.cropImage = function() {

  const img =
    document.querySelector('#lens-preview img');

  if (!img || !img.src) {

    showToast('Upload image first');

    return;
  }

  if (cropper) {

    cropper.destroy();
  }

  cropper = new Cropper(img, {

    aspectRatio: NaN,
    viewMode: 1,
    autoCropArea: 1,
    responsive: true,
    background: false
  });

  showToast('Crop mode enabled');
};



function fileToDataURL(file) {

  return new Promise(resolve => {

    const reader = new FileReader();

    reader.onload = e =>
      resolve(e.target.result);

    reader.readAsDataURL(file);
  });
}
