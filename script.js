
// ============================================================
//  TAB SWITCHING
// ============================================================
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t,i) => {
    t.classList.toggle('active', (tab === 'checker' && i === 0) || (tab === 'generator' && i === 1));
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + tab).classList.add('active');
}

// ============================================================
//  VISIBILITY TOGGLE
// ============================================================
function toggleVisibility() {
  const inp = document.getElementById('pwInput');
  const icon = document.getElementById('eye-icon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    inp.type = 'password';
    icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
}

// ============================================================
//  PASSWORD ANALYSIS
// ============================================================
const COMMON = ['123456','password','123456789','12345678','12345','1234567','qwerty','abc123','111111','password1','iloveyou','admin','letmein','monkey','dragon','master','login','welcome','solo','senha','123123','1234','sunshine','princess','shadow','superman','michael','football','senha123','pass'];

function getPool(pw) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) pool += 32;
  return pool;
}

function calcEntropy(pw) {
  const pool = getPool(pw);
  if (!pool || !pw.length) return 0;
  return Math.log2(Math.pow(pool, pw.length));
}

// Returns crack time string for attacker doing 1B guesses/second (GPU brute force)
function crackTimeString(entropy) {
  // Combinations = 2^entropy
  // At 10 billion guesses/sec (fast GPU)
  const guessesPerSec = 1e10;
  const combinations = Math.pow(2, entropy);
  const seconds = combinations / guessesPerSec / 2; // avg half of space

  if (seconds < 0.001) return { time: 'Instantâneo', desc: 'Quebrada em milissegundos com força bruta básica', color: 'var(--danger)' };
  if (seconds < 1) return { time: 'Menos de 1 segundo', desc: 'Extremamente vulnerável a qualquer ataque', color: 'var(--danger)' };
  if (seconds < 60) return { time: Math.round(seconds) + ' segundos', desc: 'Quebrada em segundos por um atacante moderno', color: 'var(--danger)' };
  if (seconds < 3600) return { time: Math.round(seconds/60) + ' minutos', desc: 'Vulnerável a ataques rápidos de força bruta', color: 'var(--danger)' };
  if (seconds < 86400) return { time: Math.round(seconds/3600) + ' horas', desc: 'Resistência baixa — evite usar para contas importantes', color: 'var(--warn)' };
  if (seconds < 2592000) return { time: Math.round(seconds/86400) + ' dias', desc: 'Segurança moderada, mas pode ser quebrada em dias', color: 'var(--warn)' };
  if (seconds < 31536000) return { time: Math.round(seconds/2592000) + ' meses', desc: 'Razoável, mas não ideal para dados sensíveis', color: 'var(--warn)' };
  if (seconds < 3153600000) return { time: Math.round(seconds/31536000) + ' anos', desc: 'Boa segurança para uso cotidiano', color: '#a8ff78' };
  if (seconds < 3.15e13) return { time: (seconds/31536000/1000).toFixed(1) + ' mil anos', desc: 'Excelente! Muito difícil de quebrar', color: 'var(--accent)' };
  if (seconds < 3.15e16) return { time: (seconds/31536000/1e6).toFixed(1) + ' milhões de anos', desc: 'Praticamente inquebrável com tecnologia atual', color: 'var(--accent)' };
  return { time: '> bilhões de anos', desc: 'Inquebrável — além da capacidade computacional conhecida', color: 'var(--accent)' };
}

function analyzePassword(pw) {
  const segs = document.querySelectorAll('.strength-seg');
  const strengthText = document.getElementById('strengthText');
  const crackTime = document.getElementById('crackTime');
  const crackDesc = document.getElementById('crackDesc');
  const crackDisplay = document.getElementById('crackDisplay');

  if (!pw) {
    segs.forEach(s => { s.style.background = 'rgba(255,255,255,0.06)'; s.style.boxShadow = ''; });
    strengthText.textContent = '— Aguardando';
    strengthText.style.color = 'var(--muted)';
    crackTime.textContent = '—';
    crackTime.style.color = 'var(--muted)';
    crackDesc.textContent = 'Digite uma senha para analisar';
    crackDisplay.style.borderColor = 'var(--border)';
    document.getElementById('sv-len').textContent = '—';
    document.getElementById('sv-ent').textContent = '—';
    document.getElementById('sv-pool').textContent = '—';
    document.getElementById('sv-comb').textContent = '—';
    ['check-len','check-upper','check-lower','check-num','check-sym','check-long'].forEach(id => {
      document.getElementById(id).className = 'check-item';
    });
    document.getElementById('breachNote').classList.remove('visible');
    return;
  }

  const entropy = calcEntropy(pw);
  const pool = getPool(pw);
  const combinations = Math.pow(2, entropy);
  const crack = crackTimeString(entropy);

  // Score 0-5
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;

  const isCommon = COMMON.includes(pw.toLowerCase());
  if (isCommon) score = 0;

  const levels = [
    { label: 'MUITO FRACA', color: 'var(--danger)' },
    { label: 'FRACA', color: '#ff6b35' },
    { label: 'RAZOÁVEL', color: 'var(--warn)' },
    { label: 'BOA', color: '#a8ff78' },
    { label: 'FORTE', color: '#00f5a0' },
    { label: 'MUITO FORTE', color: 'var(--accent2)' },
  ];

  const lvl = levels[score] || levels[0];
  strengthText.textContent = lvl.label;
  strengthText.style.color = lvl.color;

  segs.forEach((s, i) => {
    if (i <= score) {
      s.style.background = lvl.color;
      s.style.boxShadow = `0 0 8px ${lvl.color}88`;
    } else {
      s.style.background = 'rgba(255,255,255,0.06)';
      s.style.boxShadow = '';
    }
  });

  crackTime.textContent = crack.time;
  crackTime.style.color = crack.color;
  crackDesc.textContent = crack.desc;
  crackDisplay.style.borderColor = crack.color + '44';

  // Stats
  document.getElementById('sv-len').textContent = pw.length + ' chars';
  document.getElementById('sv-ent').textContent = entropy.toFixed(1);
  document.getElementById('sv-pool').textContent = pool;

  let combStr;
  if (combinations < 1e6) combStr = combinations.toFixed(0);
  else if (combinations < 1e9) combStr = (combinations/1e6).toFixed(1) + 'M';
  else if (combinations < 1e12) combStr = (combinations/1e9).toFixed(1) + 'B';
  else if (combinations < 1e15) combStr = (combinations/1e12).toFixed(1) + 'T';
  else combStr = '10^' + Math.round(Math.log10(combinations));
  document.getElementById('sv-comb').textContent = combStr;

  // Checks
  setCheck('check-len', pw.length >= 8);
  setCheck('check-upper', /[A-Z]/.test(pw));
  setCheck('check-lower', /[a-z]/.test(pw));
  setCheck('check-num', /[0-9]/.test(pw));
  setCheck('check-sym', /[^a-zA-Z0-9]/.test(pw));
  setCheck('check-long', pw.length >= 14);

  document.getElementById('breachNote').classList.toggle('visible', isCommon || pw.length < 6);
}

function setCheck(id, pass) {
  const el = document.getElementById(id);
  el.className = 'check-item ' + (pass ? 'pass' : 'fail');
}

// ============================================================
//  GENERATOR
// ============================================================
function updateOpt(cb) {
  const wrap = cb.closest('.opt-check');
  wrap.classList.toggle('checked', cb.checked);
  generatePassword();
}

function onSliderChange() {
  const v = document.getElementById('lenSlider').value;
  document.getElementById('lenDisplay').textContent = v;
  generatePassword();
}

function adjustLen(delta) {
  const slider = document.getElementById('lenSlider');
  let v = parseInt(slider.value) + delta;
  v = Math.max(4, Math.min(128, v));
  slider.value = v;
  document.getElementById('lenDisplay').textContent = v;
  generatePassword();
}

function generatePassword() {
  const len = parseInt(document.getElementById('lenSlider').value);
  const useUpper = document.getElementById('ch-upper').checked;
  const useLower = document.getElementById('ch-lower').checked;
  const useNum = document.getElementById('ch-num').checked;
  const useSym = document.getElementById('ch-sym').checked;
  const avoidAmb = document.getElementById('ch-amb').checked;
  const useExtra = document.getElementById('ch-extra').checked;

  let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lower = 'abcdefghijklmnopqrstuvwxyz';
  let nums = '0123456789';
  let syms = '!@#$%^&*()-_=+,.?';
  let extras = '[]{}|;:<>/~`';

  if (avoidAmb) {
    upper = upper.replace(/[OI]/g, '');
    lower = lower.replace(/[ol]/g, '');
    nums = nums.replace(/[01]/g, '');
  }

  let charset = '';
  let guaranteed = [];
  if (useUpper) { charset += upper; guaranteed.push(upper[Math.floor(Math.random() * upper.length)]); }
  if (useLower) { charset += lower; guaranteed.push(lower[Math.floor(Math.random() * lower.length)]); }
  if (useNum)   { charset += nums;  guaranteed.push(nums[Math.floor(Math.random() * nums.length)]); }
  if (useSym)   { charset += syms;  guaranteed.push(syms[Math.floor(Math.random() * syms.length)]); }
  if (useExtra) { charset += extras; }

  if (!charset) { document.getElementById('genOutput').textContent = 'Selecione ao menos uma opção'; return; }

  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);

  let pw = guaranteed.slice(0, len);
  for (let i = pw.length; i < len; i++) {
    pw.push(charset[arr[i] % charset.length]);
  }

  // Fisher-Yates shuffle
  for (let i = pw.length - 1; i > 0; i--) {
    const j = arr[i] % (i + 1);
    [pw[i], pw[j]] = [pw[j], pw[i]];
  }

  const result = pw.join('');
  document.getElementById('genOutput').textContent = result;

  // Entropy
  const entropy = Math.log2(Math.pow(charset.length, len));
  const pct = Math.min(100, (entropy / 200) * 100);
  document.getElementById('gen-entropy-val').textContent = entropy.toFixed(1) + ' bits';
  document.getElementById('gen-entropy-bar').style.width = pct + '%';
}

function copyGenerated() {
  const text = document.getElementById('genOutput').textContent;
  if (text === 'Clique em Gerar' || text.includes('Selecione')) return;
  navigator.clipboard.writeText(text).then(() => showToast());
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

// Init
generatePassword();
