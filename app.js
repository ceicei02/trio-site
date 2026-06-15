// ── Data ──────────────────────────────────────────────────
// Catégories d'intérêts pour mise en avant des affinités fortes
const  STRIPE_PUBLIC_KEY = pk_test_51Tif2XJDGBdPmykseDTTyUJjfYwxeRvNm9Kf7vBjztuLWPnRtua95qdUnio1XKb7Xvb1QRoRTtyUsymFJHJQ2vbL00hbmOLKfY
  sport:   { icon:'⚽', label:'Sport' },
  cuisine: { icon:'🍳', label:'Cuisine' },
  art:     { icon:'🎨', label:'Art & Culture' },
  voyage:  { icon:'✈️', label:'Voyage' },
  musique: { icon:'🎵', label:'Musique' },
  nature:  { icon:'🌿', label:'Nature' },
};
// Mes propres centres d'intérêt (utilisateur connecté) — sert à calculer les affinités
const MY_INTERESTS = ['sport','cuisine'];

const PROFILES = [
  { id:1, type:"solo", name:"Camille", age:27, city:"Paris · Marais", job:"Directrice artistique",
    photo:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
    photo2:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80",
    orientation:"Bisexuelle", intent:"Exploration & belle rencontre", match:94,
    bio:"Je crois que les meilleures connexions naissent sans attente. Je cherche quelque chose de vrai, pas un plan.",
    vibe:["Art contemporain","Vinyl","Cuisine fusion"],
    categories:["art","cuisine","musique"],
    verified:true, online:true, availableTonight:true, trustScore:92,
    vibeQ:"C'est quoi ton idée d'une soirée parfaite ?" },
  { id:2, type:"solo", name:"Marco", age:31, city:"Lyon · Croix-Rousse", job:"Architecte",
    photo:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    photo2:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80",
    orientation:"Bisexuel", intent:"Relation ouverte & complicité", match:88,
    bio:"Je dessine des espaces le jour et j'explore la vie la nuit. Non-monogame depuis 3 ans, avec soin.",
    vibe:["Architecture","Yoga","Littérature"],
    categories:["sport","art","nature"],
    verified:true, online:false, availableTonight:false, trustScore:87,
    vibeQ:"Plutôt musée ou concert pour une première fois ?" },
  { id:3, type:"solo", name:"Léa", age:25, city:"Bordeaux", job:"Musicienne",
    photo:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    photo2:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80",
    orientation:"Pansexuelle", intent:"Ce qui vient naturellement", match:91,
    bio:"Jazz, vin orange, longues balades nocturnes. Juste l'envie de rencontrer des gens qui m'étonnent.",
    vibe:["Jazz","Vin naturel","Randonnée"],
    categories:["musique","nature","cuisine"],
    verified:false, online:true, availableTonight:true, trustScore:79,
    vibeQ:"Quel morceau tu mettrais pour une soirée de folie ?" },
  { id:10, type:"duo", names:["Sofia","Antoine"], ages:[28,32], city:"Paris · 11e", jobs:["Avocate","Chef"],
    photo:"https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=600&q=80",
    photo2:"https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
    orientation:"Elle bi · Lui hétéro", intent:"Cherchent une femme pour partager", match:97,
    bio:"Ensemble depuis 4 ans, on explore depuis 1 an. On cherche quelqu'un de bien, pas juste quelqu'un.",
    vibe:["Gastronomie","Voyages","Photographie"],
    categories:["cuisine","voyage","art"],
    verified:true, online:true, availableTonight:false, trustScore:96,
    vibeQ:"La confiance, ça se construit comment pour vous ?" },
  { id:4, type:"solo", name:"Théo", age:29, city:"Marseille", job:"Médecin urgentiste",
    photo:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80",
    photo2:"https://images.unsplash.com/photo-1463453091185-61582044d556?w=600&q=80",
    orientation:"Hétéro, curieux", intent:"Découvrir sans pression", match:85,
    bio:"Entre deux gardes, je cours et je lis. Ici par curiosité sincère — pas de script.",
    vibe:["Running","SF","Mer"],
    categories:["sport","nature","voyage"],
    verified:true, online:false, availableTonight:false, trustScore:88,
    vibeQ:"Qu'est-ce qui te rend vraiment curieux en ce moment ?" },
];

const MOMENTS_DATA = [
  { img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=80",
    authorImg:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&q=70",
    name:"Camille", caption:"Soirée jazz ce soir 🎷 si vous êtes dans le coin…", time:"⏳ Expire dans 2h" },
  { img:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=700&q=80",
    authorImg:"https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=120&q=70",
    name:"Sofia & Antoine", caption:"On a cuisiné pour 10 — on est 2. Venez goûter 😂", time:"⏳ Expire dans 5h" },
  { img:"https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=80",
    authorImg:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&q=70",
    name:"Léa", caption:"En concert. L'ambiance est 🔥", time:"⏳ Expire dans 1h" },
];

// ── State ──────────────────────────────────────────────────
let profileType = 'solo';
let cardIndex = 0;
let likedIds = [10, 1];  // pre-matched
let currentProfile = null;
let vibeAnswers = {};
let filterTonight = false;
let filterGhost = false;
let activeInterestFilter = null;
let chatMessages = {
  10: [
    {from:'them', who:'Sofia', text:'Bonjour ! On est ravis de matcher 💕', t:'14:32'},
    {from:'them', who:'Antoine', text:'On a beaucoup aimé votre profil ✨', t:'14:33'},
  ],
  1: [{from:'them', who:'Camille', text:'Hey ! Ravi de matcher 😊', t:'11:20'}],
};
let currentPaymentItem = null;
let photoIndexes = {};

// ── Navigation ─────────────────────────────────────────────
function goTo(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // Hide landing too
  const landing = document.getElementById('screen-landing');
  if (landing) landing.classList.remove('active');
  document.getElementById('screen-'+screenId).classList.add('active');
  window.scrollTo(0,0);
}

function goToApp() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // no landing in app.html
  document.getElementById('main-app').classList.add('active');
  if (window.innerWidth >= 768) {
    document.getElementById('desktop-sidebar').style.display = 'flex';
  }
  renderCards();
  renderMatches();
  renderLikedGrid();
  setTimeout(() => {
    if (typeof initRetentionFeatures === 'function') initRetentionFeatures();
  }, 200);
}

function creatorBypass() {
  // Accès direct créateur — contourne l'inscription
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  // no landing in app.html
  document.getElementById('main-app').classList.add('active');
  if (window.innerWidth >= 768) {
    document.getElementById('desktop-sidebar').style.display = 'flex';
  }
  renderCards();
  renderMatches();
  renderLikedGrid();
  setTimeout(initRetentionFeatures, 200);
  showToast('⚡ Mode créateur activé');
}

function selectType(type) {
  profileType = type;
  if (type === 'duo') {
    document.getElementById('logo-duo').style.display = 'inline';
    document.getElementById('profile-duo-tag').style.display = 'inline-block';
    document.getElementById('invite-duo-btn').style.display = 'none';
  }
  goTo('verify');
  // Init captcha on first visit
  setTimeout(refreshCaptcha, 50);
}

function switchTab(tab) {
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active'));

  if (tab !== 'chat') chatProfile = null;

  const pane = document.getElementById('tab-'+tab);
  if (pane) pane.classList.add('active');

  document.querySelectorAll(`[data-tab="${tab}"]`).forEach(b => b.classList.add('active'));

  if (tab === 'discover') {
    renderCards();
    if (typeof renderProfileOfDay === 'function') renderProfileOfDay();
    if (typeof renderVibeQOD === 'function') renderVibeQOD();
    if (typeof renderHappyHour === 'function') renderHappyHour();
  }
  if (tab === 'matches') {
    if (typeof renderWeeklyLeaderboard === 'function') renderWeeklyLeaderboard();
    if (typeof renderVisitors === 'function') renderVisitors();
  }
  if (tab === 'profile') {
    if (typeof renderProfileCompletion === 'function') renderProfileCompletion();
    if (typeof renderProfileBadges === 'function') renderProfileBadges();
  }
  if (tab === 'chamber') {
    if (typeof renderChamber === 'function') renderChamber();
  }
  if (tab === 'map') {
    if (typeof renderMap === 'function') renderMap();
  }
}

// ── Web Registration flow ────────────────────────────────────
let captchaAnswer = 0;
let codeTimer = null;
let codeTimerSec = 60;
let regEmail = '';
const FAKE_CODE = '294731'; // simulated — in prod, backend sends real code

// ── CAPTCHA ─────────────────────────────────────────────────
const CAPTCHA_OPS = [
  ()=>{ const a=Math.floor(Math.random()*9)+1, b=Math.floor(Math.random()*9)+1; captchaAnswer=a+b; return `${a}  +  ${b}`; },
  ()=>{ const a=Math.floor(Math.random()*5)+5, b=Math.floor(Math.random()*5)+1; captchaAnswer=a-b; return `${a}  −  ${b}`; },
  ()=>{ const a=Math.floor(Math.random()*5)+2, b=Math.floor(Math.random()*4)+2; captchaAnswer=a*b; return `${a}  ×  ${b}`; },
];
function refreshCaptcha() {
  const fn = CAPTCHA_OPS[Math.floor(Math.random()*CAPTCHA_OPS.length)];
  document.getElementById('captcha-display').textContent = fn() + '  =  ?';
  document.getElementById('captcha-answer').value = '';
  document.getElementById('e-captcha').classList.remove('show');
  updateStep1Btn();
}
function validateCaptcha() {
  const val = parseInt(document.getElementById('captcha-answer').value);
  const ok = val === captchaAnswer;
  document.getElementById('e-captcha').classList.toggle('show', !ok && document.getElementById('captcha-answer').value.length > 0);
  updateStep1Btn();
  return ok;
}

// ── Field validators ─────────────────────────────────────────
function validateField(el) {
  const ok = el.value.trim().length >= 2;
  el.classList.toggle('valid', ok);
  el.classList.toggle('error', !ok && el.value.length > 0);
  document.getElementById('e-' + el.id.replace('f-','')).classList.toggle('show', !ok && el.value.length > 0);
  updateStep1Btn();
  return ok;
}
function validateAge(el) {
  const age = parseInt(el.value);
  const ok = age >= 18 && age <= 99;
  el.classList.toggle('valid', ok);
  el.classList.toggle('error', !ok && el.value.length > 0);
  document.getElementById('e-age').classList.toggle('show', !ok && el.value.length > 0);
  updateStep1Btn();
  return ok;
}
function validateEmail(el) {
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value);
  el.classList.toggle('valid', ok);
  el.classList.toggle('error', !ok && el.value.length > 0);
  document.getElementById('e-email').classList.toggle('show', !ok && el.value.length > 0);
  updateStep1Btn();
  return ok;
}
function checkPassword(el) {
  const v = el.value;
  const str = document.getElementById('pw-strength');
  if (!v) { str.style.display='none'; updateStep1Btn(); return; }
  str.style.display = 'block';
  const score = [v.length>=8, /[A-Z]/.test(v)||/[0-9]/.test(v), /[^A-Za-z0-9]/.test(v)||v.length>=12, v.length>=16].filter(Boolean).length;
  const bars = ['pb1','pb2','pb3','pb4'];
  const cols = ['weak','medium','medium','strong'];
  const labels = ['','Faible','Moyen','Fort','Très fort'];
  bars.forEach((id,i) => {
    const b = document.getElementById(id);
    b.className = 'pw-bar' + (i < score ? ' '+cols[score-1] : '');
  });
  document.getElementById('pw-label').textContent = labels[score] ? `Sécurité : ${labels[score]}` : '';
  updateStep1Btn();
}
function updateStep1Btn() {
  const ok = document.getElementById('f-prenom').classList.contains('valid') &&
             document.getElementById('f-age').classList.contains('valid') &&
             document.getElementById('f-email').classList.contains('valid') &&
             document.getElementById('f-password').value.length >= 8 &&
             parseInt(document.getElementById('captcha-answer').value) === captchaAnswer &&
             document.getElementById('captcha-answer').value.length > 0;
  document.getElementById('btn-step1').disabled = !ok;
}

// ── Step 1 submit ─────────────────────────────────────────────
let regUserData = {};

function submitStep1() {
  if (!validateCaptcha()) return;
  regEmail = document.getElementById('f-email').value;
  const password = document.getElementById('f-password').value;
  regUserData = {
    prenom: document.getElementById('f-prenom').value,
    age: document.getElementById('f-age').value,
    profileType,
    password,
  };
  // Utiliser Supabase si disponible, sinon mode demo
  if (typeof authSignUp === 'function') {
    authSignUp(regEmail, password, regUserData);
  } else {
    // Mode demo (sans Supabase)
    setStepDone(1); setStepActive(2);
    document.getElementById('reg-step1').classList.remove('active');
    document.getElementById('reg-step2').classList.add('active');
    document.getElementById('email-sent-to').textContent = `Code envoyé à ${regEmail}`;
    setTimeout(()=>{ const d=document.querySelectorAll('.code-digit'); if(d[0]) d[0].focus(); },100);
    startCodeTimer();
  }
}

// ── Step 2 — email code ───────────────────────────────────────
function onCodeInput(el, idx) {
  el.classList.toggle('filled', el.value.length === 1);
  if (el.value.length === 1) {
    const digits = document.querySelectorAll('.code-digit');
    if (idx < 5) digits[idx+1].focus();
  }
  checkCodeComplete();
}
function onCodeBack(el, e, idx) {
  if (e.key === 'Backspace' && el.value === '' && idx > 0) {
    const digits = document.querySelectorAll('.code-digit');
    digits[idx-1].focus();
    digits[idx-1].value = '';
    digits[idx-1].classList.remove('filled');
  }
}
function checkCodeComplete() {
  const digits = document.querySelectorAll('.code-digit');
  const code = Array.from(digits).map(d=>d.value).join('');
  document.getElementById('btn-step2').disabled = code.length < 6;
}
function submitStep2() {
  const digits = document.querySelectorAll('.code-digit');
  const code = Array.from(digits).map(d=>d.value).join('');
  // Utiliser Supabase si disponible
  if (typeof authVerifyOTP === 'function') {
    authVerifyOTP(regEmail, code);
  } else {
    // Mode demo — accepte n'importe quel code à 6 chiffres
    if (code.length === 6) {
      clearInterval(codeTimer);
      setStepDone(2); setStepActive(3);
      document.getElementById('reg-step2').classList.remove('active');
      document.getElementById('reg-step3').classList.add('active');
    } else {
      document.getElementById('e-code').classList.add('show');
      document.querySelectorAll('.code-digit').forEach(d=>d.classList.add('error'));
      setTimeout(()=>{
        document.getElementById('e-code').classList.remove('show');
        document.querySelectorAll('.code-digit').forEach(d=>{d.classList.remove('error');d.value='';d.classList.remove('filled');});
        document.querySelectorAll('.code-digit')[0].focus();
      },1500);
    }
  }
}
function goBackStep1() {
  clearInterval(codeTimer);
  setStepActive(1);
  document.getElementById('reg-step2').classList.remove('active');
  document.getElementById('reg-step1').classList.add('active');
  document.getElementById('sc2').className='reg-step-circle';
  document.getElementById('sl2').className='reg-step-label';
  document.getElementById('line1').classList.remove('done');
}
function startCodeTimer() {
  codeTimerSec = 600;
  clearInterval(codeTimer);
  const el = document.getElementById('code-timer');
  const btn = document.getElementById('btn-resend');
  btn.disabled = true;
  codeTimer = setInterval(()=>{
    codeTimerSec--;
    const m = Math.floor(codeTimerSec / 60);
    const s = codeTimerSec % 60;
    el.textContent = ` (${m}:${String(s).padStart(2,'0')})`;
    if (codeTimerSec <= 0) {
      clearInterval(codeTimer);
      el.textContent = '';
      btn.disabled = false;
    }
  },1000);
}
function resendCode() {
  if (typeof authResendCode === 'function') {
    authResendCode();
  } else {
    showToast('📧 Nouveau code envoyé à ' + regEmail);
    startCodeTimer();
  }
}

// ── Step 3 — consents ─────────────────────────────────────────
const checks = {};
function toggleCheck(id) {
  checks[id] = !checks[id];
  const box = document.getElementById(id);
  box.classList.toggle('checked', checks[id]);
  const allRequired = checks['chk-age'] && checks['chk-cgu'] && checks['chk-charte'];
  document.getElementById('btn-step3').disabled = !allRequired;
}
function submitStep3() {
  if (typeof authCreateProfile === 'function') {
    // Supabase — crée le profil en base et lance l'app
    authCreateProfile();
    setStepDone(3);
  } else {
    // Mode demo
    const panel = document.getElementById('reg-step3');
    panel.innerHTML = `
      <div style="text-align:center;padding:30px 0;">
        <div style="width:44px;height:44px;border:3px solid var(--rose);border-top-color:transparent;
          border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px;"></div>
        <div style="font-size:14px;color:var(--text3);">Création de votre profil…</div>
      </div>`;
    setTimeout(()=>{
      panel.innerHTML = `
        <div class="reg-success">
          <div class="reg-success-icon">🎉</div>
          <div class="reg-success-title">Bienvenue sur trio !</div>
          <p class="reg-success-sub">Votre compte est créé. Complétez votre profil pour apparaître dans les recherches.</p>
          <button class="btn-reg" onclick="goToApp()">Découvrir trio →</button>
        </div>`;
      setStepDone(3);
    },1800);
  }
}

// ── Step bar helpers ──────────────────────────────────────────
function setStepDone(n) {
  document.getElementById('sc'+n).className='reg-step-circle done';
  document.getElementById('sc'+n).textContent='✓';
  if(n<3) document.getElementById('line'+n).classList.add('done');
}
function setStepActive(n) {
  document.getElementById('sc'+n).className='reg-step-circle active';
  document.getElementById('sl'+n).className='reg-step-label active';
}

// ── Moments ────────────────────────────────────────────────
function openMoment(i) {
  const m = MOMENTS_DATA[i];
  document.getElementById('moment-img').src = m.img;
  document.getElementById('moment-author-img').src = m.authorImg;
  document.getElementById('moment-author-name').textContent = m.name;
  document.getElementById('moment-time').textContent = m.time;
  document.getElementById('moment-caption').textContent = m.caption;
  document.getElementById('moment-full').classList.add('active');
}
function closeMoment() {
  document.getElementById('moment-full').classList.remove('active');
}

// ── Cards rendering ─────────────────────────────────────────
function getShownProfiles() {
  let profiles = PROFILES.filter(p => !p.passed);
  if (filterTonight) profiles = profiles.filter(p => p.availableTonight);
  if (activeInterestFilter) {
    profiles = profiles.filter(p => p.categories && p.categories.includes(activeInterestFilter));
  } else {
    // Sans filtre actif : mettre en avant les profils à forte affinité (sport/cuisine en priorité)
    profiles = [...profiles].sort((a, b) => getSharedInterests(b).length - getSharedInterests(a).length);
  }
  return profiles;
}

function toggleInterestFilter(cat) {
  activeInterestFilter = (activeInterestFilter === cat) ? null : cat;
  document.querySelectorAll('.interest-chip').forEach(el => el.classList.remove('active'));
  if (activeInterestFilter) {
    const chip = document.getElementById('chip-'+cat);
    if (chip) chip.classList.add('active');
    const label = INTEREST_CATEGORIES[cat].label;
    showToast(`${INTEREST_CATEGORIES[cat].icon} Affichage des profils « ${label} »`);
  }
  renderCards();
}

function renderCards() {
  const stack = document.getElementById('card-stack');
  const btns = document.getElementById('action-btns');
  const shown = getShownProfiles();
  stack.innerHTML = '';

  if (shown.length === 0) {
    stack.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${activeInterestFilter ? INTEREST_CATEGORIES[activeInterestFilter].icon : filterTonight ? '🌙' : '✨'}</div>
        <div class="empty-title">${activeInterestFilter ? 'Aucun profil « '+INTEREST_CATEGORIES[activeInterestFilter].label+' »' : filterTonight ? 'Personne de dispo ce soir' : 'C\'est tout pour aujourd\'hui'}</div>
        <p class="empty-sub">${activeInterestFilter ? 'Essayez une autre affinité ou désactivez le filtre.' : filterTonight ? 'Désactivez le filtre « Ce soir » pour voir plus de profils.' : 'Revenez demain ou essayez le Mode Voyage.'}</p>
        ${activeInterestFilter ? `<button class="btn-ghost" onclick="toggleInterestFilter('${activeInterestFilter}')">Voir tous les profils</button>` : filterTonight ? '<button class="btn-ghost" onclick="toggleFilter(\'tonight\')">Voir tous les profils</button>' : '<button class="btn-ghost" onclick="showToast(\'✈️ Mode Voyage bientôt disponible !\')">✈️ Mode Voyage</button>'}
      </div>`;
    btns.style.display = 'none';
    return;
  }

  btns.style.display = 'flex';
  currentProfile = shown[0];

  shown.slice(0, 3).forEach((p, i) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper ' + (['top','back1','back2'][i] || 'back2');
    wrapper.innerHTML = buildCard(p, i === 0);
    stack.appendChild(wrapper);
  });

  // Drag logic on top card
  initDrag(stack.querySelector('.card-wrapper.top .card'));
}

// ── Affinités d'intérêts (sport, cuisine, etc.) ──────────────
function getSharedInterests(p) {
  if (!p.categories) return [];
  return p.categories.filter(c => MY_INTERESTS.includes(c));
}

function buildCard(p, isTop) {
  const isDuo = p.type === 'duo';
  const name = isDuo ? `${p.names[0]} & ${p.names[1]}` : p.name;
  const age = isDuo ? `${p.ages[0]}-${p.ages[1]}` : p.age;
  const idx = photoIndexes[p.id] || 0;
  const photos = [p.photo, p.photo2];
  const tc = p.trustScore > 85 ? 'var(--green)' : p.trustScore > 65 ? 'var(--gold)' : 'var(--rose)';
  const shared = getSharedInterests(p);

  const waveBars = Array.from({length:10}, (_,i) => {
    const h = [1,1.6,.8,1.4,.9,1.2,1,.7,1.3,.8][i];
    return `<div class="wave-bar" style="height:${h*12}px;animation-delay:${i*0.08}s"></div>`;
  }).join('');

  return `
    <div class="card" data-id="${p.id}" style="${filterGhost?'opacity:.88':''}">
      <div class="card-photo" onclick="openProfileSheet(${p.id})">
        <img src="${photos[idx]}" alt="" loading="lazy">
        <div class="photo-tabs">
          ${photos.map((_,i)=>`<div class="photo-tab ${i===idx?'active':''}" onclick="event.stopPropagation();changePhoto(${p.id},${i})"></div>`).join('')}
        </div>
        <div class="card-gradient"></div>
        <div class="stamp stamp-like">LIKE</div>
        <div class="stamp stamp-nope">NOPE</div>
        <div class="card-badges">
          ${p.verified ? '<span class="cbadge cbadge-verified">✓ Vérifié</span>' : ''}
          ${isDuo ? '<span class="cbadge cbadge-duo">💑 Duo</span>' : ''}
          ${filterGhost ? '<span class="cbadge cbadge-ghost">👻 Fantôme</span>' : ''}
        </div>
        ${p.availableTonight ? `<div class="tonight-badge"><div class="tonight-ring"></div><div class="tonight-pulse"></div>Ce soir</div>` : ''}
        ${shared.length ? `<div class="affinity-badge">${shared.map(c=>INTEREST_CATEGORIES[c].icon).join(' ')} Affinité ${shared.length>1?'forte':''}</div>` : ''}
        <div class="card-name-block">
          <div><span class="card-name">${name}</span><span class="card-age">${age}</span></div>
          <div class="card-location">📍 ${p.city} · ${isDuo ? p.jobs[0] : p.job}</div>
          <div class="trust-row">
            <span class="trust-label">Confiance</span>
            <div class="trust-bar-wrap"><div class="trust-bar-fill" style="width:${p.trustScore}%;background:${tc}"></div></div>
            <span class="trust-score" style="color:${tc}">${p.trustScore}</span>
          </div>
        </div>
      </div>
      <div class="card-bottom">
        <div class="voice-player" onclick="toggleVoice(this)" data-playing="false">
          <div class="voice-btn">🎤</div>
          <div style="flex:1">
            <div class="voice-meta">VoiceBio · 15s</div>
            <div class="wave-container">${waveBars}</div>
          </div>
          <div class="voice-timer">0:15</div>
        </div>
        <p class="card-bio">${p.bio}</p>
        <div class="card-footer">
          <div class="card-vibes">
            ${shared.length ? shared.map(c=>`<span class="vibe-tag vibe-tag-match">${INTEREST_CATEGORIES[c].icon} ${INTEREST_CATEGORIES[c].label}</span>`).join('') : ''}
            ${p.vibe.slice(0, shared.length ? 1 : 2).map(v=>`<span class="vibe-tag">${v}</span>`).join('')}
          </div>
          ${isTop ? `<button class="vibe-check-btn" onclick="openVibeCheck()">❓ Vibe Check</button>` : ''}
        </div>
      </div>
    </div>`;
}

function changePhoto(pid, idx) {
  photoIndexes[pid] = idx;
  renderCards();
}

// ── Drag / swipe ───────────────────────────────────────────
function initDrag(card) {
  if (!card) return;
  let startX = 0, curX = 0, dragging = false;

  const onDown = (e) => {
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    dragging = true;
    card.classList.add('dragging');
  };
  const onMove = (e) => {
    if (!dragging) return;
    curX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    card.style.transform = `translateX(${curX}px) rotate(${curX*0.033}deg)`;
    const likeS = card.querySelector('.stamp-like');
    const nopeS = card.querySelector('.stamp-nope');
    if (curX > 35) { likeS.classList.add('show'); nopeS.classList.remove('show'); }
    else if (curX < -35) { nopeS.classList.add('show'); likeS.classList.remove('show'); }
    else { likeS.classList.remove('show'); nopeS.classList.remove('show'); }
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    card.classList.remove('dragging');
    if (curX > 90) swipeCard('right');
    else if (curX < -90) swipeCard('left');
    else { card.style.transform = ''; curX = 0; }
  };

  card.addEventListener('mousedown', onDown);
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseup', onUp);
  card.addEventListener('mouseleave', onUp);
  card.addEventListener('touchstart', onDown, {passive:true});
  card.addEventListener('touchmove', onMove, {passive:true});
  card.addEventListener('touchend', onUp);
}

function swipeCard(dir) {
  if (!currentProfile) return;
  const stack = document.getElementById('card-stack');
  const topWrapper = stack.querySelector('.card-wrapper.top');
  if (!topWrapper) return;
  const card = topWrapper.querySelector('.card');
  card.classList.add(dir === 'right' ? 'swiping-right' : 'swiping-left');

  const p = currentProfile;
  if (dir === 'right') {
    if (!likedIds.includes(p.id)) {
      likedIds.push(p.id);
      const willMatch = Math.random() > 0.3;
      if (willMatch) {
        chatMessages[p.id] = chatMessages[p.id] || [{
          from:'them', who: p.type==='duo'?p.names[0]:p.name,
          text:'Bonjour ! Ravi(e) de matcher 💕',
          t: new Date().toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'})
        }];
        setTimeout(() => showMatch(p), 500);
      } else {
        showToast(`♥ Vous avez liké ${p.type==='duo'?p.names[0]:p.name}`);
      }
    }
  }

  p.passed = true;
  document.querySelectorAll(`#nav-badge, #sb-badge`).forEach(b => b.textContent = likedIds.length);

  setTimeout(() => {
    renderCards();
    renderMatches();
    renderLikedGrid();
  }, 380);
}

// ── Voice player ───────────────────────────────────────────
let voiceInterval = null;
function toggleVoice(player) {
  const isPlaying = player.dataset.playing === 'true';
  // stop any playing
  document.querySelectorAll('.voice-player[data-playing="true"]').forEach(p => {
    p.dataset.playing = 'false';
    p.classList.remove('playing');
    p.querySelector('.voice-btn').textContent = '🎤';
    p.querySelector('.voice-timer').textContent = '0:15';
  });
  clearInterval(voiceInterval);

  if (!isPlaying) {
    player.dataset.playing = 'true';
    player.classList.add('playing');
    player.querySelector('.voice-btn').textContent = '⏸';
    let secs = 0;
    voiceInterval = setInterval(() => {
      secs++;
      player.querySelector('.voice-timer').textContent = `${secs}s`;
      if (secs >= 15) {
        clearInterval(voiceInterval);
        player.dataset.playing = 'false';
        player.classList.remove('playing');
        player.querySelector('.voice-btn').textContent = '🎤';
        player.querySelector('.voice-timer').textContent = '0:15';
      }
    }, 1000);
  }
}

// ── Profile sheet ───────────────────────────────────────────
function openProfileSheet(id) {
  const p = PROFILES.find(x => x.id === id);
  if (!p) return;
  const isDuo = p.type === 'duo';
  const name = isDuo ? `${p.names[0]} & ${p.names[1]}` : p.name;
  const age = isDuo ? `${p.ages[0]}-${p.ages[1]}` : p.age;
  const tc = p.trustScore > 85 ? 'var(--green)' : p.trustScore > 65 ? 'var(--gold)' : 'var(--rose)';
  const shared = getSharedInterests(p);

  document.getElementById('profile-sheet-content').innerHTML = `
    <div class="profile-hero">
      <img src="${p.photo}" alt="" loading="lazy">
      <div class="profile-hero-gradient"></div>
      <div class="profile-hero-info">
        <div><span class="profile-name">${name}</span><span class="profile-name-age">${age} ans</span></div>
        <div class="trust-row" style="margin-top:6px;">
          <span class="trust-label">Confiance</span>
          <div class="trust-bar-wrap"><div class="trust-bar-fill" style="width:${p.trustScore}%;background:${tc}"></div></div>
          <span class="trust-score" style="color:${tc}">${p.trustScore}</span>
        </div>
      </div>
      <button class="modal-close" onclick="closeSheet('profile-sheet')">✕</button>
    </div>
    <div class="tag-row">
      ${p.verified ? '<span class="tag tag-teal">✓ Vérifié trio</span>' : ''}
      ${p.availableTonight ? '<span class="tag tag-teal">🟢 Ce soir</span>' : ''}
      ${isDuo ? '<span class="tag tag-rose">💑 Profil Duo</span>' : ''}
      ${shared.length ? `<span class="tag tag-affinity">${shared.map(c=>INTEREST_CATEGORIES[c].icon).join(' ')} Affinité ${shared.length>1?'forte':''}</span>` : ''}
      <span class="tag tag-match">❤️ ${p.match}% compatible</span>
    </div>
    ${shared.length ? `
    <div class="affinity-box">
      <div class="affinity-box-label">✨ Vous avez en commun</div>
      <div class="affinity-box-items">
        ${shared.map(c=>`<span class="affinity-pill">${INTEREST_CATEGORIES[c].icon} ${INTEREST_CATEGORIES[c].label}</span>`).join('')}
      </div>
    </div>` : ''}
    <div class="section-label">🎤 VoiceBio</div>
    <div class="voice-player" onclick="toggleVoice(this)" data-playing="false" style="margin-bottom:16px;">
      <div class="voice-btn">🎤</div>
      <div style="flex:1">
        <div class="voice-meta">VoiceBio · 15s</div>
        <div class="wave-container">${Array.from({length:10},(_,i)=>`<div class="wave-bar" style="height:${[1,1.6,.8,1.4,.9,1.2,1,.7,1.3,.8][i]*12}px;animation-delay:${i*0.08}s"></div>`).join('')}</div>
      </div>
      <div class="voice-timer">0:15</div>
    </div>
    <div class="vibe-q-box">
      <div class="vibe-q-label">❓ Vibe Check</div>
      <div class="vibe-q-text">"${p.vibeQ}"</div>
    </div>
    ${[{k:'Orientation',v:p.orientation},{k:'Cherche',v:p.intent},{k:isDuo?'Jobs':'Profession',v:isDuo?p.jobs.join(' · '):p.job}].map(r=>`<div class="info-row"><span class="info-key">${r.k}</span><span class="info-val">${r.v}</span></div>`).join('')}
    <div class="section-label">À propos</div>
    <p class="bio-full">${p.bio}</p>
    <div class="section-label" style="margin-top:12px;">Univers</div>
    <div class="card-vibes" style="margin-bottom:18px;">
      ${(p.categories||[]).map(c=>{
        const isShared = MY_INTERESTS.includes(c);
        return `<span class="vibe-tag ${isShared?'vibe-tag-match':''}">${INTEREST_CATEGORIES[c].icon} ${INTEREST_CATEGORIES[c].label}</span>`;
      }).join('')}
      ${p.vibe.map(v=>`<span class="vibe-tag">${v}</span>`).join('')}
    </div>
    <div class="album-teaser">
      <div class="album-thumbs">${['#d45177','#9b6dd4','#c9a46a'].map(c=>`<div class="album-thumb" style="background:${c}22;border:2px solid var(--bg);"></div>`).join('')}</div>
      <div><div class="album-info-title">Album privé · 6 photos</div><div class="album-info-sub">Visible après match</div></div>
      <button class="album-btn" onclick="openPayment('Album Unlock','1.99')">€1.99</button>
    </div>
    <div class="cta-row">
      <button class="btn-pass" onclick="closeSheet('profile-sheet');swipeCard('left')">Passer</button>
      <button class="btn-like-full" onclick="closeSheet('profile-sheet');swipeCard('right')">♥ J'aime ce profil</button>
    </div>`;
  document.getElementById('profile-sheet').classList.add('active');
}

// ── Vibe Check ──────────────────────────────────────────────
function openVibeCheck() {
  if (!currentProfile) return;
  const p = currentProfile;
  const isDuo = p.type === 'duo';
  document.getElementById('vibe-content').innerHTML = `
    <div id="vc-main">
      <div class="vc-profile">
        <div class="vc-avatar"><img src="${p.photo}" alt="" style="width:100%;height:100%;object-fit:cover;"></div>
        <div><div class="vc-name">${isDuo?p.names[0]:p.name}</div><div style="font-size:10px;color:var(--text3);">vous pose une question</div></div>
        <span class="vc-badge">❓ Vibe Check</span>
      </div>
      <div class="vc-question-box"><div class="vc-q">"${p.vibeQ}"</div></div>
      <div class="vc-anon-note"><span>👻</span>Votre réponse est anonyme jusqu'au match mutuel</div>
      <textarea class="vc-textarea" id="vc-answer" placeholder="Répondez sincèrement…" oninput="document.getElementById('vc-send').disabled=!this.value.trim()"></textarea>
      <div class="vc-btns">
        <button class="vc-skip" onclick="closeSheet('vibe-modal')">Passer</button>
        <button class="vc-send" id="vc-send" disabled onclick="sendVibeAnswer()">Envoyer ma réponse →</button>
      </div>
    </div>`;
  document.getElementById('vibe-modal').classList.add('active');
}

function sendVibeAnswer() {
  const answer = document.getElementById('vc-answer').value.trim();
  if (!answer || !currentProfile) return;
  vibeAnswers[currentProfile.id] = answer;
  document.getElementById('vibe-content').innerHTML = `
    <div class="vc-success">
      <div class="vc-success-icon">✨</div>
      <div class="vc-success-title">Réponse envoyée !</div>
      <p class="vc-success-sub">Si ${currentProfile.type==='duo'?currentProfile.names[0]:currentProfile.name} vous répond aussi,<br>le match se révèle automatiquement.</p>
    </div>`;
  setTimeout(() => { closeSheet('vibe-modal'); swipeCard('right'); }, 1600);
}

// ── Match overlay ───────────────────────────────────────────
function showMatch(p) {
  const isDuo = p.type === 'duo';
  document.getElementById('match-photo').src = p.photo;
  document.getElementById('match-name').textContent = (isDuo ? `${p.names[0]} & ${p.names[1]}` : p.name) + ' ont matché !';
  document.getElementById('match-sub2').textContent = isDuo ? 'Le couple est prêt à se connecter.' : 'La connexion est là.';

  const va = document.getElementById('vibe-answers');
  if (vibeAnswers[p.id]) {
    va.style.display = 'block';
    va.innerHTML = `
      <div class="va-label">❓ Vos Vibe Checks</div>
      <div class="va-line">Votre réponse : <span>"${vibeAnswers[p.id]}"</span></div>
      <div class="va-line">Sa réponse : <span>"Une soirée jazz sur les quais 🎷"</span></div>`;
  } else {
    va.style.display = 'none';
  }
  document.getElementById('match-overlay').classList.add('active');
  // Haptic feedback (mobile)
  if (navigator.vibrate) navigator.vibrate([60, 40, 120]);
  // Confetti celebration
  if (typeof spawnConfetti === 'function') spawnConfetti();
}

function closeMatch() {
  document.getElementById('match-overlay').classList.remove('active');
  renderMatches();
  renderLikedGrid();
}

// ── Matches & liked ─────────────────────────────────────────
function renderMatches() {
  const list = document.getElementById('matches-list');
  const matched = PROFILES.filter(p => likedIds.includes(p.id));
  document.getElementById('matches-sub').textContent = `${matched.length} match${matched.length>1?'s':''} confirmé${matched.length>1?'s':''}`;

  list.innerHTML = matched.map(p => {
    const isDuo = p.type === 'duo';
    const name = isDuo ? `${p.names[0]} & ${p.names[1]}` : p.name;
    return `
      <div class="match-list-item" onclick="openChat(${p.id})">
        <div class="match-list-av${isDuo?' duo':''}">
          <img src="${p.photo}" alt="" style="width:100%;height:100%;object-fit:cover;">
          ${p.online ? '<div class="match-online-dot"></div>' : ''}
        </div>
        <div style="flex:1">
          <div class="match-list-name">${name}</div>
          <div class="match-list-city">
            ${p.availableTonight ? '<span class="match-list-tonight">🟢 Ce soir · </span>' : ''}
            <span style="font-size:12px;color:var(--text3);">${p.city}</span>
          </div>
        </div>
        <span class="match-list-arrow">›</span>
      </div>`;
  }).join('');
}

function renderLikedGrid() {
  const grid = document.getElementById('liked-grid');
  grid.innerHTML = PROFILES.slice(0, 3).map(p => {
    const name = p.type === 'duo' ? p.names[0] : p.name;
    return `
      <div class="liked-thumb" onclick="openProfileSheet(${p.id})">
        <img src="${p.photo}" alt="" style="width:100%;height:100%;object-fit:cover;">
        <div class="liked-thumb-name">${name}</div>
      </div>`;
  }).join('');
}

// ── Chat ────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════
//  MESSAGERIE TEMPS RÉEL — Supabase Realtime
// ══════════════════════════════════════════════════════════════

let chatProfile = null;
let chatMatchId = null;        // ID du match Supabase en cours
let chatRealtimeSub = null;    // Subscription Realtime active
let localMessages = {};        // Cache local des messages par matchId

// ── Ouvrir une conversation ────────────────────────────────────
async function openChat(id) {
  const p = PROFILES.find(x => x.id === id);
  if (!p) return;
  chatProfile = p;
  const isDuo = p.type === 'duo';

  // Mettre à jour le header du chat
  document.getElementById('chat-av-img').src = p.photo;
  document.getElementById('chat-av').className = 'chat-av' + (isDuo ? ' duo' : '');
  document.getElementById('chat-name').textContent = isDuo ? `${p.names[0]} & ${p.names[1]}` : p.name;

  const tc = p.trustScore > 85 ? 'var(--green)' : p.trustScore > 65 ? 'var(--gold)' : 'var(--rose)';
  document.getElementById('chat-trust-fill').style.cssText = `width:${p.trustScore}%;background:${tc}`;
  document.getElementById('chat-trust-score').style.color = tc;
  document.getElementById('chat-trust-score').textContent = p.trustScore;

  switchTab('chat');

  // Si Supabase disponible → charger vrais messages
  if (typeof fetchMessages === 'function' && typeof currentUser !== 'undefined' && currentUser) {
    await openRealChat(p);
  } else {
    // Mode demo — messages simulés
    renderMessages(id);
  }
}

// ── Mode réel : charger le match + messages + écouter ─────────
async function openRealChat(p) {
  const container = document.getElementById('messages');
  container.innerHTML = `<div style="text-align:center;padding:40px 0;"><div class="typing-dots" style="justify-content:center;"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;

  try {
    // Trouver le matchId entre currentUser et ce profil
    const { data: matches } = await window.supabase
      .from('matches')
      .select('id')
      .or(`and(user_1.eq.${currentUser.id},user_2.eq.${p.id}),and(user_1.eq.${p.id},user_2.eq.${currentUser.id})`)
      .limit(1);

    if (!matches || matches.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:40px 16px;color:var(--text3);font-size:13px;">Pas encore de match avec ${p.name}.<br>Likez-vous mutuellement pour débloquer le chat.</div>`;
      return;
    }

    chatMatchId = matches[0].id;

    // Charger l'historique des messages
    const messages = await fetchMessages(chatMatchId);
    localMessages[chatMatchId] = messages;
    renderRealMessages(chatMatchId);

    // Marquer comme lu
    if (typeof markMessagesRead === 'function') {
      markMessagesRead(chatMatchId);
    }

    // S'abonner aux nouveaux messages en temps réel
    if (chatRealtimeSub) {
      window.supabase.removeChannel(chatRealtimeSub);
    }

    chatRealtimeSub = subscribeToMessages(chatMatchId, (newMsg) => {
      // Ne pas dupliquer les messages qu'on vient d'envoyer
      if (newMsg.sender_id === currentUser.id) return;
      localMessages[chatMatchId] = localMessages[chatMatchId] || [];
      localMessages[chatMatchId].push(newMsg);
      renderRealMessages(chatMatchId);
      // Supprimer l'indicateur de frappe si présent
      const ti = document.getElementById('typing-indicator');
      if (ti) ti.remove();
    });

  } catch (err) {
    console.error('[trio] openRealChat error:', err);
    renderMessages(p.id); // fallback demo
  }
}

// ── Rendu des vrais messages Supabase ─────────────────────────
function renderRealMessages(matchId) {
  const msgs = localMessages[matchId] || [];
  const container = document.getElementById('messages');
  if (!container) return;

  if (msgs.length === 0) {
    container.innerHTML = `
      <div style="text-align:center;padding:48px 16px;">
        <div style="font-size:32px;margin-bottom:12px;">👋</div>
        <div style="font-size:14px;color:var(--text2);font-family:var(--ff);font-style:italic;">C'est un nouveau match !</div>
        <div style="font-size:12px;color:var(--text3);margin-top:6px;">Soyez le premier à briser la glace.</div>
      </div>`;
    return;
  }

  container.innerHTML = msgs.map(m => {
    const isMe = currentUser && m.sender_id === currentUser.id;
    const time = new Date(m.created_at).toLocaleTimeString('fr', {hour:'2-digit', minute:'2-digit'});
    if (isMe) {
      return `<div class="msg-row me">
        <div>
          <div class="msg-bubble me">${escapeHtml(m.content)}</div>
          <div class="msg-time" style="text-align:right;padding-right:4px;">${time}</div>
        </div>
      </div>`;
    }
    return `<div class="msg-row">
      <div class="msg-av-small">
        ${chatProfile?.photo ? `<img src="${chatProfile.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` : ''}
      </div>
      <div>
        <div class="msg-bubble them">${escapeHtml(m.content)}</div>
        <div class="msg-time" style="padding-left:4px;">${time}</div>
      </div>
    </div>`;
  }).join('');

  container.scrollTop = container.scrollHeight;
}

// ── Rendu des messages simulés (mode demo) ────────────────────
function renderMessages(id) {
  const msgs = chatMessages[id] || [];
  const container = document.getElementById('messages');
  if (!container) return;
  container.innerHTML = msgs.map(m => buildMessage(m)).join('');
  container.scrollTop = container.scrollHeight;
}

function buildMessage(m) {
  if (!chatProfile) return '';
  const isDuo = chatProfile.type === 'duo';
  if (m.from === 'me') {
    return `<div class="msg-row me">
      <div>
        <div class="msg-bubble me">${m.text}</div>
        <div class="msg-time" style="text-align:right;padding-right:4px;">${m.t}</div>
      </div>
    </div>`;
  }
  return `<div class="msg-row">
    <div class="msg-av-small"><img src="${chatProfile.photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>
    <div>
      ${isDuo && m.who ? `<div class="msg-who">${m.who}</div>` : ''}
      <div class="msg-bubble them">${m.text}</div>
      <div class="msg-time" style="padding-left:4px;">${m.t}</div>
    </div>
  </div>`;
}

// ── Envoyer un message ────────────────────────────────────────
let typingTimeout = null;
async function sendMsg() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text || !chatProfile) return;

  input.value = '';
  updateSendBtn();

  // Mode réel — Supabase
  if (typeof sendMessage === 'function' && currentUser && chatMatchId) {
    // Ajouter immédiatement dans l'UI (optimistic update)
    localMessages[chatMatchId] = localMessages[chatMatchId] || [];
    localMessages[chatMatchId].push({
      id: 'tmp-' + Date.now(),
      sender_id: currentUser.id,
      content: text,
      created_at: new Date().toISOString(),
      match_id: chatMatchId,
    });
    renderRealMessages(chatMatchId);

    // Envoyer en base
    await sendMessage(chatMatchId, text);

  } else {
    // Mode demo — réponse simulée
    const now = new Date().toLocaleTimeString('fr', {hour:'2-digit', minute:'2-digit'});
    chatMessages[chatProfile.id] = chatMessages[chatProfile.id] || [];
    chatMessages[chatProfile.id].push({from:'me', text, t:now});
    renderMessages(chatProfile.id);

    // Indicateur de frappe simulé
    const container = document.getElementById('messages');
    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.id = 'typing-indicator';
    typing.innerHTML = `
      <div class="typing-av"><img src="${chatProfile.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div>
      <div class="typing-dots">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>`;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      const replies = ["C'est adorable 😊","Haha exactement !","Tu sembles vraiment sympa ✨","On devrait se retrouver bientôt 🍷","J'adore cette idée !","Dis-moi en plus 😊"];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const t = new Date().toLocaleTimeString('fr', {hour:'2-digit', minute:'2-digit'});
      const ti = document.getElementById('typing-indicator');
      if (ti) ti.remove();
      chatMessages[chatProfile.id].push({
        from:'them',
        who: chatProfile.type==='duo' ? chatProfile.names[Math.random()>.5?0:1] : chatProfile.name,
        text: reply, t
      });
      renderMessages(chatProfile.id);
    }, 1200 + Math.random()*700);
  }
}

function updateSendBtn() {
  const btn = document.getElementById('chat-send');
  const val = document.getElementById('chat-input')?.value?.trim();
  if (btn) btn.className = 'chat-send' + (val ? ' ready' : '');
}

// ── Utilitaire : échapper le HTML pour éviter les injections ──
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}


// ── Filters ─────────────────────────────────────────────────
function toggleFilter(type) {
  if (type === 'tonight') {
    filterTonight = !filterTonight;
    const btn = document.getElementById('btn-tonight');
    const dot = document.getElementById('dot-tonight');
    btn.className = 'filter-btn' + (filterTonight ? ' active-teal' : '');
    dot.className = 'filter-dot' + (filterTonight ? ' pulse' : '');
  } else if (type === 'ghost') {
    filterGhost = !filterGhost;
    const btn = document.getElementById('btn-ghost');
    btn.className = 'filter-btn' + (filterGhost ? ' active-violet' : '');
    document.getElementById('ghost-banner').className = 'ghost-banner' + (filterGhost ? ' visible' : '');
  }
  renderCards();
}

// ── Payment (Stripe-ready) ──────────────────────────────────
function openPayment(item, price) {
  currentPaymentItem = {item, price};
  document.getElementById('payment-content').innerHTML = `
    <div class="stripe-modal active">
      <div class="stripe-title">Finaliser l'achat</div>
      <p class="stripe-desc">Paiement sécurisé par Stripe · Aucun abonnement</p>
      <div class="stripe-summary">
        <span class="stripe-item">${item}</span>
        <span class="stripe-amount">€${price}</span>
      </div>
      <div class="card-field-wrap">
        <div class="card-field-label">NUMÉRO DE CARTE</div>
        <input class="card-field" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCard(this)">
      </div>
      <div class="card-row">
        <div class="card-field-wrap">
          <div class="card-field-label">EXPIRATION</div>
          <input class="card-field" placeholder="MM/AA" maxlength="5" oninput="formatExp(this)">
        </div>
        <div class="card-field-wrap">
          <div class="card-field-label">CVC</div>
          <input class="card-field" placeholder="123" maxlength="3">
        </div>
      </div>
      <div class="stripe-security">
        <span class="stripe-lock">🔒</span>
        Paiement chiffré SSL · Vos données ne sont jamais stockées par trio
      </div>
      <button class="btn-pay" onclick="processPayment()">Payer €${price} →</button>
      <button class="stripe-cancel" onclick="closeSheet('payment-modal')">Annuler</button>
      <div style="display:flex;justify-content:center;margin-top:8px;gap:6px;opacity:.5;">
        ${['💳','🔐','✓'].map(i=>`<span style="font-size:14px;">${i}</span>`).join('')}
        <span style="font-size:10px;color:var(--text3);align-self:center;">Powered by Stripe</span>
      </div>
    </div>`;
  document.getElementById('payment-modal').classList.add('active');
}

function formatCard(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}
function formatExp(input) {
  let v = input.value.replace(/\D/g,'');
  if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2,4);
  input.value = v;
}

function processPayment() {
  if (!currentPaymentItem) return;
  // Simulate Stripe processing
  document.getElementById('payment-content').innerHTML = `
    <div style="text-align:center;padding:30px 0;">
      <div style="width:40px;height:40px;border:3px solid var(--rose);border-top-color:transparent;border-radius:50%;animation:spin .8s linear infinite;margin:0 auto 16px;"></div>
      <div style="font-size:14px;color:var(--text3);">Traitement en cours…</div>
    </div>`;

  setTimeout(() => {
    document.getElementById('payment-content').innerHTML = `
      <div class="pay-success">
        <div class="pay-success-icon">✅</div>
        <div class="pay-success-title">Paiement réussi !</div>
        <p class="pay-success-sub">${currentPaymentItem.item} activé avec succès.<br>Vous recevrez une confirmation par email.</p>
        <button class="btn-done" onclick="closeSheet('payment-modal')">Fermer</button>
      </div>`;
    showToast(`✅ ${currentPaymentItem.item} activé !`);
  }, 2000);
}

// ── Modals ──────────────────────────────────────────────────
function closeSheet(id) {
  document.getElementById(id).classList.remove('active');
}

// ── Toast ────────────────────────────────────────────────────
let toastTimeout;
function showToast(msg) {
  clearTimeout(toastTimeout);
  const t = document.getElementById('toast');
  document.getElementById('toast-text').textContent = msg;
  t.style.animation = 'none';
  t.offsetHeight; // reflow
  t.style.animation = '';
  t.classList.add('show');
  toastTimeout = setTimeout(() => t.classList.remove('show'), 3400);
}

// ── Init ─────────────────────────────────────────────────────
// ── Init ─────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const sidebar = document.getElementById('desktop-sidebar');
  if (document.getElementById('main-app').classList.contains('active')) {
    sidebar.style.display = window.innerWidth >= 768 ? 'flex' : 'none';
  }
});

// ── Landing page live counter ─────────────────────────────────
(function() {
  let base = 4827;
  function tick() {
    const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    base = Math.max(4800, base + delta);
    const el = document.getElementById('live-count');
    const sm = document.getElementById('stat-members');
    const fmt = base.toLocaleString('fr-FR');
    if (el) el.textContent = fmt;
    if (sm) sm.textContent = fmt;
    setTimeout(tick, 2800 + Math.random() * 3000);
  }
  setTimeout(tick, 3000);
})();

// ── Scroll reveal ─────────────────────────────────────────────
(function() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin:'0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ── FAQ toggle ────────────────────────────────────────────────
function toggleFaq(item) {
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// ── CTA tracking ──────────────────────────────────────────────
function trackCTA(source) {
  console.log('[trio analytics] CTA clicked:', source);
}

// ═══════════════════════════════════════════════════════
//  LOCALISATION — Système type Lovoo
// ═══════════════════════════════════════════════════════

// Simulated nearby profiles with GPS coords relative to user
const NEARBY_PROFILES = [
  { id:1,  name:'Camille',         age:27, city:'Paris · Marais',    type:'solo', online:true,
    dist:280,   angle:38,  photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&q=70',
    job:'Directrice artistique', lastSeen:'En ligne', match:94, orientation:'Bisexuelle' },
  { id:10, name:'Sofia & Antoine', age:28, city:'Paris · 11e',       type:'duo',  online:true,
    dist:650,   angle:125, photo:'https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=300&q=70',
    job:'Avocate & Chef',        lastSeen:'En ligne', match:97, orientation:'Elle bi · Lui hétéro' },
  { id:3,  name:'Léa',             age:25, city:'Paris · Bastille',  type:'solo', online:true,
    dist:920,   angle:210, photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=300&q=70',
    job:'Musicienne',            lastSeen:'Il y a 3 min', match:91, orientation:'Pansexuelle' },
  { id:2,  name:'Marco',           age:31, city:'Paris · République',type:'solo', online:false,
    dist:1400,  angle:290, photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=70',
    job:'Architecte',            lastSeen:'Il y a 18 min', match:88, orientation:'Bisexuel' },
  { id:4,  name:'Théo',            age:29, city:'Paris · Oberkampf', type:'solo', online:false,
    dist:2100,  angle:55,  photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=70',
    job:'Médecin',               lastSeen:'Il y a 1h', match:85, orientation:'Hétéro curieux' },
  { id:11, name:'Chloé & Romain',  age:26, city:'Paris · Nation',    type:'duo',  online:false,
    dist:3200,  angle:160, photo:'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&q=70',
    job:'Designer & Ingénieur',  lastSeen:'Il y a 2h', match:89, orientation:'Elle pan · Lui bi' },
];

// Map state
let mapState = {
  view: 'radar',       // 'radar' | 'map' | 'list'
  radius: 5,           // km
  sortBy: 'dist',      // 'dist' | 'online' | 'match'
  scanning: false,
  scanInterval: null,
  blipsVisible: [],
  userLat: 48.8566,
  userLng: 2.3522,
};

function formatDist(m) {
  if (m < 1000) return { num: m, unit: 'm' };
  return { num: (m/1000).toFixed(1), unit: 'km' };
}

function filterByRadius(profiles) {
  return profiles.filter(p => p.dist <= mapState.radius * 1000);
}

function sortProfiles(profiles) {
  const list = [...profiles];
  if (mapState.sortBy === 'dist') list.sort((a,b) => a.dist - b.dist);
  else if (mapState.sortBy === 'online') list.sort((a,b) => (b.online?1:0) - (a.online?1:0));
  else if (mapState.sortBy === 'match') list.sort((a,b) => b.match - a.match);
  return list;
}

// ── MAIN RENDER ───────────────────────────────────────────────
function renderMap() {
  const root = document.getElementById('map-root');
  if (!root) return;

  const visible = filterByRadius(NEARBY_PROFILES);
  const radiusBtns = [0.5,1,2,5,10,20].map(r =>
    `<button class="radius-btn${mapState.radius===r?' active':''}" onclick="setRadius(${r})">${r<1?r*1000+'m':r+'km'}</button>`
  ).join('');

  root.innerHTML = `
    <div class="map-container">
      <!-- Header -->
      <div class="map-topbar">
        <div class="map-title">Autour de moi</div>
        <div class="map-live">
          <div class="map-live-dot"></div>
          ${visible.filter(p=>p.online).length} en ligne
        </div>
      </div>

      <!-- Radius -->
      <div class="radius-filter">${radiusBtns}</div>

      <!-- View toggle -->
      <div class="map-view-toggle">
        <button class="view-toggle-btn${mapState.view==='radar'?' active':''}" onclick="setMapView('radar')">
          📡 Radar
        </button>
        <button class="view-toggle-btn${mapState.view==='map'?' active':''}" onclick="setMapView('map')">
          🗺 Carte
        </button>
        <button class="view-toggle-btn${mapState.view==='list'?' active':''}" onclick="setMapView('list')">
          ☰ Liste
        </button>
      </div>

      <!-- View content -->
      <div id="map-view-content"></div>

      <!-- Nearby list (always shown below) -->
      <div id="nearby-list-wrap"></div>
    </div>`;

  renderMapView(visible);
  renderNearbyList(visible);
}

function setRadius(r) {
  mapState.radius = r;
  renderMap();
}
function setMapView(v) {
  mapState.view = v;
  const visible = filterByRadius(NEARBY_PROFILES);
  renderMapView(visible);
}

// ── RADAR VIEW ────────────────────────────────────────────────
function renderMapView(visible) {
  const content = document.getElementById('map-view-content');
  if (!content) return;
  if (mapState.view === 'radar') renderRadarView(content, visible);
  else if (mapState.view === 'map')  renderMapCanvas(content, visible);
  else content.innerHTML = '';
}

function renderRadarView(container, profiles) {
  const maxDist = mapState.radius * 1000;
  const rings = [0.25, 0.5, 0.75, 1.0];

  container.innerHTML = `
    <div class="radar-wrap">
      <div class="radar-canvas" id="radar-canvas">
        <!-- Rings -->
        ${rings.map(r => `<div class="radar-ring" style="width:${r*100}%;height:${r*100}%;"></div>`).join('')}
        <!-- Grid lines -->
        <div class="radar-line-h"></div>
        <div class="radar-line-v"></div>
        <!-- Sweep -->
        <div class="radar-sweep"></div>
        <!-- Center -->
        <div class="radar-center"></div>
        <!-- Distance labels -->
        <div class="radar-dist-labels">
          ${rings.map(r => {
            const km = (maxDist * r / 1000).toFixed(1);
            return `<div class="radar-dist-label" style="top:${50 - r*50 - 3}%;left:52%;">${km<1?(km*1000|0)+'m':km+'km'}</div>`;
          }).join('')}
        </div>
        <!-- Profile blips -->
        ${profiles.map((p, i) => {
          const rad = (p.angle * Math.PI) / 180;
          const r = Math.min(p.dist / maxDist, 0.92);
          const x = 50 + Math.cos(rad) * r * 47;
          const y = 50 + Math.sin(rad) * r * 47;
          const sz = p.dist < 500 ? 36 : p.dist < 1500 ? 30 : 26;
          const pingSize = sz + 16;
          return `
            <div class="radar-blip${p.online?' radar-blip-online':''}"
              style="left:${x}%;top:${y}%;animation-delay:${i*0.12}s;"
              onclick="openMapProfile(${p.id})">
              <div class="radar-blip-ping" style="width:${pingSize}px;height:${pingSize}px;animation-delay:${i*0.4}s;"></div>
              <div class="radar-blip-img" style="width:${sz}px;height:${sz}px;">
                <img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
              </div>
            </div>`;
        }).join('')}
      </div>
      <!-- Scan button -->
      <div style="text-align:center;margin-top:12px;">
        <button id="scan-btn" onclick="startRadarScan()" style="padding:9px 22px;border-radius:99px;background:rgba(212,81,119,.15);border:1px solid rgba(212,81,119,.35);font-size:12px;color:var(--rose);cursor:pointer;font-family:var(--fs);font-weight:600;transition:all .2s;">
          📡 Scanner maintenant
        </button>
        <div style="font-size:10px;color:var(--text3);margin-top:6px;" id="scan-status">
          ${profiles.length} profil${profiles.length>1?'s':''} dans un rayon de ${mapState.radius}km
        </div>
      </div>
    </div>`;
}

function startRadarScan() {
  const btn = document.getElementById('scan-btn');
  const status = document.getElementById('scan-status');
  if (!btn) return;
  btn.textContent = '⟳ Scan en cours…';
  btn.disabled = true;
  let count = 0;
  const itv = setInterval(() => {
    count++;
    if (status) status.textContent = `Détection… ${count} profil${count>1?'s':''} trouvé${count>1?'s':''}`;
    if (count >= filterByRadius(NEARBY_PROFILES).length) {
      clearInterval(itv);
      btn.disabled = false;
      btn.textContent = '✓ Scan terminé';
      setTimeout(() => {
        btn.textContent = '📡 Scanner maintenant';
        if (status) status.textContent = `${count} profil${count>1?'s':''} dans un rayon de ${mapState.radius}km`;
      }, 2000);
      showToast(`📡 ${count} profil${count>1?'s':''} détecté${count>1?'s':''} !`);
    }
  }, 350);
}

// ── MAP CANVAS VIEW ───────────────────────────────────────────
function renderMapCanvas(container, profiles) {
  const maxDist = mapState.radius * 1000;

  // Generate fake street lines
  const streets = [
    {x:10,y:50,w:80,h:3},{x:50,y:5,w:3,h:90},{x:20,y:30,w:60,h:2},
    {x:15,y:70,w:70,h:2},{x:30,y:15,w:2,h:70},{x:70,y:20,w:2,h:60},
    {x:5,y:45,w:90,h:1},{x:40,y:0,w:1,h:100},
  ];

  container.innerHTML = `
    <div class="map-view">
      <div class="map-bg"></div>
      <!-- Streets -->
      ${streets.map(s=>`<div class="map-street" style="left:${s.x}%;top:${s.y}%;width:${s.w}%;height:${s.h}px;"></div>`).join('')}

      <!-- My position -->
      <div class="map-me" style="left:50%;top:50%;">
        <div class="map-me-ring"></div>
        <div class="map-me-dot"></div>
      </div>

      <!-- Profile pins -->
      ${profiles.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const r = Math.min(p.dist / maxDist, 0.88);
        const x = 50 + Math.cos(rad) * r * 42;
        const y = 50 + Math.sin(rad) * r * 42;
        const d = formatDist(p.dist);
        return `
          <div class="map-pin${p.online?' online':''}"
            style="left:${x}%;top:${y}%;animation-delay:${i*0.1}s;"
            onclick="openMapProfile(${p.id})">
            <div class="map-pin-avatar">
              <img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;">
            </div>
            <div class="map-pin-tail"></div>
            <div class="map-pin-shadow"></div>
            <div class="map-pin-dist">${d.num}${d.unit}</div>
          </div>`;
      }).join('')}

      <!-- Controls -->
      <div class="map-controls">
        <div class="map-ctrl-btn" onclick="showToast('🗺 Zoom avant')">+</div>
        <div class="map-ctrl-btn" onclick="showToast('🗺 Zoom arrière')">−</div>
        <div class="map-ctrl-btn" onclick="showToast('📍 Recentrage')">◎</div>
      </div>

      <!-- Accuracy -->
      <div class="map-accuracy">
        <div class="map-live-dot"></div>
        GPS précis à ±15m
      </div>
    </div>`;
}

// ── NEARBY LIST ───────────────────────────────────────────────
function renderNearbyList(profiles) {
  const wrap = document.getElementById('nearby-list-wrap');
  if (!wrap) return;
  const sorted = sortProfiles(profiles);

  wrap.innerHTML = `
    <div class="nearby-header">
      <div class="nearby-title">${profiles.length} profil${profiles.length>1?'s':''} à proximité</div>
      <button class="nearby-sort" onclick="cycleSortBy()">
        Trier : ${mapState.sortBy==='dist'?'Distance':mapState.sortBy==='online'?'En ligne':'Compatibilité'}
      </button>
    </div>
    ${sorted.map(p => {
      const d = formatDist(p.dist);
      return `
        <div class="nearby-item" onclick="openMapProfile(${p.id})">
          <div class="nearby-av">
            <img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
            ${p.online ? '<div class="nearby-online-ring"></div>' : ''}
          </div>
          <div style="flex:1;min-width:0;">
            <div class="nearby-name">${p.name}${p.type==='duo'?' <span style="font-size:10px;color:var(--rose);font-family:var(--fs);font-style:normal;">duo</span>':''}, ${p.age}</div>
            <div class="nearby-meta">
              ${p.job}
              ${p.online ? ' · <span style="color:var(--teal);">En ligne</span>' : ''}
            </div>
          </div>
          <div class="nearby-dist">
            <div class="nearby-dist-num">${d.num}</div>
            <div class="nearby-dist-unit">${d.unit}</div>
            <div class="nearby-seen">${p.lastSeen}</div>
          </div>
        </div>`;
    }).join('')}`;
}

function cycleSortBy() {
  const opts = ['dist','online','match'];
  mapState.sortBy = opts[(opts.indexOf(mapState.sortBy)+1) % opts.length];
  renderNearbyList(filterByRadius(NEARBY_PROFILES));
}

// ── PROFILE POPUP ─────────────────────────────────────────────
function openMapProfile(id) {
  const p = NEARBY_PROFILES.find(x => x.id === id);
  if (!p) return;
  const d = formatDist(p.dist);
  const isDuo = p.type === 'duo';

  document.getElementById('map-popup-content').innerHTML = `
    <div class="map-popup-hero">
      <img src="${p.photo}" alt="">
      <div class="map-popup-gradient"></div>
      <div class="map-popup-info">
        <div class="dist-badge">📍 À ${d.num}${d.unit}</div>
        <div style="font-family:var(--ff);font-size:24px;font-style:italic;color:var(--text);">
          ${p.name}${isDuo?' & …':''}
          <span style="font-size:16px;color:var(--text3);font-family:var(--fs);font-style:normal;"> ${p.age}</span>
        </div>
        <div style="font-size:11px;color:var(--text3);margin-top:2px;">${p.job}</div>
      </div>
      <button onclick="closeMapPopup()" style="position:absolute;top:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.5);border:none;color:#fff;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;">✕</button>
    </div>
    <div style="display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap;">
      <span style="padding:4px 12px;border-radius:99px;font-size:11px;color:${p.online?'var(--teal)':'var(--text3)'};border:1px solid ${p.online?'rgba(77,189,182,.3)':'var(--border)'};">
        ${p.online ? '🟢 En ligne maintenant' : '⏱ '+p.lastSeen}
      </span>
      <span style="padding:4px 12px;border-radius:99px;font-size:11px;color:var(--rose);border:1px solid rgba(212,81,119,.3);">❤️ ${p.match}% compatible</span>
      ${isDuo?'<span style="padding:4px 12px;border-radius:99px;font-size:11px;color:var(--violet);border:1px solid rgba(155,109,212,.3);">💑 Profil duo</span>':''}
    </div>
    ${[{k:'Orientation',v:p.orientation},{k:'Cherche',v:PROFILES.find(x=>x.id===p.id)?.intent||'—'}].map(r=>`
      <div style="display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--border);">
        <span style="font-size:11px;color:var(--text3);width:90px;flex-shrink:0;">${r.k}</span>
        <span style="font-size:13px;color:var(--text);">${r.v}</span>
      </div>`).join('')}
    <div class="map-popup-actions">
      <button class="map-popup-btn-msg" onclick="closeMapPopup();switchTab('matches')">💬 Message</button>
      <button class="map-popup-btn-like" onclick="handleLike(PROFILES.find(x=>x.id===${p.id})||NEARBY_PROFILES.find(x=>x.id===${p.id}));closeMapPopup();showToast('♥ Vous avez liké ${p.name} !')">♥ J'aime</button>
    </div>`;

  document.getElementById('map-profile-popup').classList.add('active');
}

function closeMapPopup() {
  document.getElementById('map-profile-popup').classList.remove('active');
}

// Simulate live position updates
function startLivePositionUpdates() {
  setInterval(() => {
    const idx = Math.floor(Math.random() * NEARBY_PROFILES.length);
    const delta = (Math.random() - 0.5) * 40;
    NEARBY_PROFILES[idx].dist = Math.max(50, NEARBY_PROFILES[idx].dist + delta);
    const mapPane = document.getElementById('tab-map');
    if (mapPane && mapPane.classList.contains('active')) {
      renderNearbyList(filterByRadius(NEARBY_PROFILES));
    }
  }, 8000);
}

// ── CTA tracking ──────────────────────────────────────────────
function trackCTA(source) {
  console.log('[trio analytics] CTA clicked:', source);
}

// ═══════════════════════════════════════════════════════
//  RETENTION FEATURES ENGINE
// ═══════════════════════════════════════════════════════

// ── 1. STREAK SYSTEM ─────────────────────────────────────────
const STREAK = { days: 3, lastSeen: Date.now() };
function showStreakInfo() {
  const modal = document.getElementById('streak-modal');
  // Populate days grid
  const grid = document.getElementById('streak-days-grid');
  if (grid) {
    const days = ['L','M','M','J','V','S','D'];
    grid.innerHTML = days.map((d,i) => `
      <div style="text-align:center;">
        <div style="font-size:9px;color:var(--text3);margin-bottom:4px;">${d}</div>
        <div style="height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;
          ${i<3 ? 'background:rgba(212,81,119,.2);border:1px solid rgba(212,81,119,.4);' : 'background:var(--s2);border:1px solid var(--border);'}">
          ${i<3 ? '🔥' : '·'}
        </div>
      </div>`).join('');
  }
  modal.style.display = 'flex';
}
function closeStreakModal() {
  document.getElementById('streak-modal').style.display = 'none';
}

// ── 2. PROFILE OF THE DAY ─────────────────────────────────────
const POD_PROFILE = {
  name:'Camille', age:27, city:'Paris · Marais', match:94,
  photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80',
  id:1
};
let podCountdown = 23*3600 + 41*60 + 18;
let podInterval = null;

function renderProfileOfDay() {
  const wrap = document.getElementById('profile-of-day-wrap');
  if (!wrap) return;
  const h = Math.floor(podCountdown/3600);
  const m = Math.floor((podCountdown%3600)/60);
  const s = podCountdown%60;
  const timeStr = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  wrap.innerHTML = `
    <div class="pod-card" onclick="openProfileSheet(${POD_PROFILE.id})">
      <img class="pod-img" src="${POD_PROFILE.photo}">
      <div class="pod-overlay"></div>
      <div class="pod-label">⭐ Profil du jour</div>
      <div class="pod-countdown" id="pod-time">⏳ ${timeStr}</div>
      <div class="pod-info">
        <div>
          <div class="pod-name">${POD_PROFILE.name}, ${POD_PROFILE.age}</div>
          <div class="pod-meta">📍 ${POD_PROFILE.city}</div>
        </div>
        <div class="pod-match">❤️ ${POD_PROFILE.match}%</div>
      </div>
    </div>`;
  clearInterval(podInterval);
  podInterval = setInterval(()=>{
    podCountdown = Math.max(0, podCountdown-1);
    const el = document.getElementById('pod-time');
    if (!el) { clearInterval(podInterval); return; }
    const h2=Math.floor(podCountdown/3600), m2=Math.floor((podCountdown%3600)/60), s2=podCountdown%60;
    el.textContent = `⏳ ${String(h2).padStart(2,'0')}:${String(m2).padStart(2,'0')}:${String(s2).padStart(2,'0')}`;
  }, 1000);
}

// ── 3. VIBE QUESTION OF THE DAY ───────────────────────────────
const VIBE_QUESTIONS_DAY = [
  "Si tu pouvais vivre n'importe où dans le monde demain, ce serait où ?",
  "C'est quoi ton souvenir le plus embarrassant mais drôle ?",
  "Quel est le dernier truc qui t'a vraiment fait rire aux éclats ?",
  "Tu préfères un dimanche matin parfait ou un vendredi soir parfait ?",
  "Le dernier film ou série qui t'a vraiment touché·e ?",
  "Quelle est ta définition d'une belle rencontre ?",
  "Si tu devais décrire ta vie en 3 émojis, lesquels ?",
];
let vqdAnswered = false;

function renderVibeQOD() {
  const wrap = document.getElementById('vibe-question-day-wrap');
  if (!wrap) return;
  const dayIdx = new Date().getDay();
  const q = VIBE_QUESTIONS_DAY[dayIdx % VIBE_QUESTIONS_DAY.length];
  wrap.innerHTML = `
    <div class="vibe-qod">
      <div class="vibe-qod-label">❓ Question du jour</div>
      <div class="vibe-qod-q">"${q}"</div>
      ${vqdAnswered
        ? `<div class="vibe-qod-done" style="display:flex;align-items:center;gap:6px;">
             <span>✓</span> Réponse envoyée — visible par vos matchs aujourd'hui !
           </div>`
        : `<input class="vibe-qod-input" id="vqd-inp" placeholder="Votre réponse…" maxlength="120">
           <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;">
             <button class="vibe-qod-submit" onclick="submitVQD()">Partager ma réponse ✦</button>
             <span style="font-size:10px;color:var(--text3);">Visible par vos matchs</span>
           </div>`
      }
    </div>`;
}

function submitVQD() {
  const inp = document.getElementById('vqd-inp');
  if (!inp || !inp.value.trim()) return;
  vqdAnswered = true;
  renderVibeQOD();
  showToast('✨ Réponse partagée avec vos matchs !');
}

// ── 4. MOMENT REACTIONS ───────────────────────────────────────
function reactToMoment(emoji) {
  const btns = document.querySelectorAll('.moment-react-btn');
  btns.forEach(b => b.classList.remove('reacted'));
  event.currentTarget.classList.add('reacted');
  const count = event.currentTarget.querySelector('.react-count');
  if (count) count.textContent = parseInt(count.textContent||0)+1;
  setTimeout(()=>{ closeMoment(); showToast(emoji+' Réaction envoyée !'); }, 400);
}

// ── 5. PROXIMITY NOTIFICATION ─────────────────────────────────
const PROXIMITY_PROFILES = [
  { name:'Camille', dist:'280m', photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=70' },
  { name:'Sofia & Antoine', dist:'650m', photo:'https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=80&q=70' },
  { name:'Léa', dist:'120m', photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=70' },
];
let proximityShown = false;

function triggerProximityNotif() {
  if (proximityShown) return;
  const p = PROXIMITY_PROFILES[Math.floor(Math.random()*PROXIMITY_PROFILES.length)];
  document.getElementById('prox-photo').src = p.photo;
  document.getElementById('prox-name').textContent = p.name + ' est dans le coin !';
  document.getElementById('prox-dist').textContent = '📍 À '+p.dist+' de vous ce soir';
  const el = document.getElementById('proximity-notif');
  el.style.display = 'block';
  proximityShown = true;
  setTimeout(closeProximity, 8000);
}
function closeProximity() {
  document.getElementById('proximity-notif').style.display = 'none';
}

// ── 6. ICE BREAKER IA ─────────────────────────────────────────
const ICE_BREAKERS = [
  ["Ton VoiceBio m'a beaucoup plu — tu as une vraie présence dans ta voix. C'est quoi ton truc ?",
   "J'ai vu que tu aimais le jazz. Tu as un concert ou une playlist coup de cœur en ce moment ?",
   "Ta réponse au Vibe Check m'a intrigué·e. Tu penses vraiment que la confiance ça se construit ou ça se ressent d'emblée ?"],
  ["Bordeaux + musique + vin naturel, ça donne envie. C'est quoi ton bar préféré là-bas ?",
   "Ton profil dégage quelque chose de très libre. Tu as toujours été comme ça ou c'est venu avec le temps ?",
   "Si on se retrouvait demain pour un café sans pression, tu le verrais où ce café ?"],
  ["4 ans ensemble et on explore depuis 1 an — j'aimerais savoir comment vous avez eu cette conversation pour la première fois ?",
   "La gastronomie + les voyages, c'est le combo parfait. Votre meilleur souvenir de table ensemble ?",
   "Ce qui m'a touché dans votre bio, c'est 'pas juste quelqu'un'. Qu'est-ce que ça veut dire pour vous ?"],
];

let currentIBProfile = null;
let currentIBSet = 0;

function openIceBreaker(profile) {
  currentIBProfile = profile;
  currentIBSet = 0;
  renderIceBreakerSuggestions();
  const modal = document.getElementById('icebreaker-modal');
  modal.style.display = 'flex';
}
function closeIceBreaker() {
  document.getElementById('icebreaker-modal').style.display = 'none';
}
function renderIceBreakerSuggestions() {
  const set = ICE_BREAKERS[currentIBSet % ICE_BREAKERS.length];
  document.getElementById('icebreaker-suggestions').innerHTML = set.map((text,i)=>`
    <div class="ib-suggestion" onclick="selectIceBreaker(this,'${text.replace(/'/g,"\\'")}')">
      <div class="ib-text">"${text}"</div>
      <span class="ib-send">→</span>
    </div>`).join('');
}
function regenerateIceBreakers() {
  currentIBSet++;
  renderIceBreakerSuggestions();
}
function selectIceBreaker(el, text) {
  document.querySelectorAll('.ib-suggestion').forEach(s=>s.classList.remove('selected'));
  el.classList.add('selected');
  setTimeout(()=>{
    closeIceBreaker();
    showToast('💬 Message envoyé à '+
      (currentIBProfile ? (currentIBProfile.type==='duo' ? currentIBProfile.names[0] : currentIBProfile.name) : '')
      +' !');
  }, 500);
}

// ── 7. BADGES SYSTEM ─────────────────────────────────────────
const USER_BADGES = [
  { key:'first', label:'Premier match 🌸', class:'pb-first' },
  { key:'chamber', label:'Chambre résolue 🗝️', class:'pb-chamber' },
  { key:'streak', label:'Série 3j 🔥', class:'pb-streak' },
  { key:'verified', label:'Vérifié ✓', class:'pb-verified' },
];

function getBadgesHTML() {
  return `<div class="profile-badges-row">
    ${USER_BADGES.map(b=>`<span class="pb ${b.class}">${b.label}</span>`).join('')}
  </div>`;
}

// ── 8. WEEKLY LEADERBOARD ────────────────────────────────────
const WEEKLY_LB = [
  { name:'Camille M.', city:'Paris', likes:47, photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=70' },
  { name:'Sofia & Antoine', city:'Paris', likes:41, photo:'https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=80&q=70' },
  { name:'Marco D.', city:'Lyon', likes:38, photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70' },
  { name:'Léa B.', city:'Bordeaux', likes:29, photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=70' },
  { name:'Théo R.', city:'Marseille', likes:24, photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70' },
];
const WLB_RANKS = ['👑','🥈','🥉','4','5'];
let wlbCountdown = 4*24*3600 - 3*3600; // 4 days remaining

function renderWeeklyLeaderboard() {
  const wrap = document.getElementById('weekly-leaderboard-wrap');
  if (!wrap) return;
  const d = Math.floor(wlbCountdown/86400);
  const h = Math.floor((wlbCountdown%86400)/3600);
  wrap.innerHTML = `
    <div class="weekly-lb">
      <div class="weekly-lb-header">
        <div class="weekly-lb-title">🏆 Top profils — Paris</div>
        <div class="weekly-lb-reset">Reset dans ${d}j ${h}h</div>
      </div>
      ${WEEKLY_LB.map((p,i)=>`
        <div class="wlb-item">
          <div class="wlb-rank">${WLB_RANKS[i]||i+1}</div>
          <div class="wlb-av"><img src="${p.photo}" style="width:100%;height:100%;object-fit:cover;"></div>
          <div style="flex:1;">
            <div class="wlb-name">${p.name}</div>
            <div class="wlb-city">${p.city}</div>
          </div>
          <div class="wlb-likes">♥ ${p.likes}</div>
        </div>`).join('')}
      <div style="text-align:center;padding:10px 0;font-size:11px;color:var(--text3);">
        Votre position cette semaine : <strong style="color:var(--rose);">#23</strong> — continuez à liker !
      </div>
    </div>`;
}

// ── Init all retention features ──────────────────────────────
function initRetentionFeatures() {
  renderProfileOfDay();
  renderVibeQOD();
  renderWeeklyLeaderboard();
  renderNotifications();
  renderVisitors();
  renderHappyHour();
  renderProfileCompletion();
  renderProfileBadges();
  // Trigger proximity after 12 seconds
  setTimeout(triggerProximityNotif, 12000);
  // Start live GPS simulation
  startLivePositionUpdates();
  // Show daily reward after a short delay (once per session)
  setTimeout(maybeShowDailyReward, 1400);
  // Periodically bump notifications to simulate life
  startNotifSimulation();
}

// ═══════════════════════════════════════════════════════
//  NOTIFICATIONS CENTER
// ═══════════════════════════════════════════════════════
let NOTIFICATIONS = [
  { id:1, type:'like', unread:true, photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=70',
    text:'<strong>Camille</strong> a aimé votre profil', time:'Il y a 4 min' },
  { id:2, type:'match', unread:true, photo:'https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=80&q=70',
    text:'Nouveau match avec <strong>Sofia & Antoine</strong> 💕', time:'Il y a 18 min' },
  { id:3, type:'visit', unread:true, photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=70',
    text:'<strong>Léa</strong> a visité votre profil', time:'Il y a 1h' },
  { id:4, type:'vibe', unread:false, icon:'❓',
    text:'<strong>Marco</strong> a répondu à votre Vibe Check', time:'Il y a 2h' },
  { id:5, type:'chamber', unread:false, icon:'🗝️',
    text:'Une nouvelle Chambre Secrète ouvre demain !', time:'Il y a 3h' },
  { id:6, type:'boost', unread:false, icon:'⚡',
    text:'Votre Spark Boost a généré <strong>12 vues</strong>', time:'Hier' },
];
let notifPanelOpen = false;

function renderNotifications() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  const iconMap = { like:'❤️', match:'💕', visit:'👀', vibe:'❓', chamber:'🗝️', boost:'⚡' };
  list.innerHTML = NOTIFICATIONS.map(n => `
    <div class="notif-item ${n.unread?'unread':''}" onclick="handleNotifClick(${n.id})">
      ${n.photo
        ? `<div class="notif-av"><img src="${n.photo}" style="width:100%;height:100%;object-fit:cover;"></div>`
        : `<div class="notif-av icon">${n.icon||iconMap[n.type]||'🔔'}</div>`}
      <div style="flex:1;">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>`).join('');
  updateBellBadge();
}

function updateBellBadge() {
  const count = NOTIFICATIONS.filter(n => n.unread).length;
  const badge = document.getElementById('bell-badge');
  if (!badge) return;
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

function toggleNotifs() {
  notifPanelOpen = !notifPanelOpen;
  document.getElementById('notif-panel').classList.toggle('open', notifPanelOpen);
  document.getElementById('notif-backdrop').classList.toggle('open', notifPanelOpen);
}

function handleNotifClick(id) {
  const n = NOTIFICATIONS.find(x => x.id === id);
  if (n) n.unread = false;
  renderNotifications();
  toggleNotifs();
  if (n && (n.type === 'like' || n.type === 'visit')) switchTab('matches');
  else if (n && n.type === 'match') switchTab('matches');
  else if (n && n.type === 'chamber') switchTab('chamber');
}

function markAllRead() {
  NOTIFICATIONS.forEach(n => n.unread = false);
  renderNotifications();
}

function startNotifSimulation() {
  const pool = [
    { type:'like', photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70', text:'<strong>Théo</strong> a aimé votre profil' },
    { type:'visit', photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70', text:'<strong>Marco</strong> a visité votre profil' },
    { type:'like', photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=70', text:'Quelqu\'un a aimé votre profil 👀' },
  ];
  setInterval(() => {
    const tpl = pool[Math.floor(Math.random()*pool.length)];
    NOTIFICATIONS.unshift({ id:Date.now(), unread:true, time:'À l\'instant', ...tpl });
    if (NOTIFICATIONS.length > 12) NOTIFICATIONS.pop();
    renderNotifications();
    const bell = document.getElementById('notif-bell');
    if (bell) { bell.classList.add('has-new'); setTimeout(()=>bell.classList.remove('has-new'), 1500); }
  }, 45000); // every 45s
}

// ═══════════════════════════════════════════════════════
//  QUI M'A VU — Visiteurs de profil
// ═══════════════════════════════════════════════════════
const VISITORS = [
  { name:'Camille', time:'4 min', online:true,  blurred:false, photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=70', id:1 },
  { name:'?????',   time:'1h',    online:false, blurred:true,  photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=70', id:2 },
  { name:'Léa',     time:'2h',    online:true,  blurred:false, photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&q=70', id:3 },
  { name:'?????',   time:'3h',    online:false, blurred:true,  photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=70', id:4 },
  { name:'?????',   time:'5h',    online:false, blurred:true,  photo:'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=200&q=70', id:11 },
];

function renderVisitors() {
  const wrap = document.getElementById('visitors-wrap');
  if (!wrap) return;
  const total = 14;
  wrap.innerHTML = `
    <div class="visitors-section">
      <div class="visitors-head">
        <div class="visitors-title">👀 Qui m'a vu</div>
        <div class="visitors-count">${total} cette semaine</div>
      </div>
      <div class="visitors-scroll">
        ${VISITORS.map(v => `
          <div class="visitor-card" onclick="${v.blurred ? `unlockVisitors()` : `openProfileSheet(${v.id})`}">
            <div class="visitor-img ${v.blurred?'blurred':''}">
              <img src="${v.photo}" alt="">
              ${v.blurred ? `<div class="visitor-lock"><div class="visitor-lock-icon">🔒</div><div class="visitor-lock-text">Débloquer</div></div>` : ''}
              <div class="visitor-time-badge">${v.time}</div>
              ${v.online && !v.blurred ? '<div class="visitor-online"></div>' : ''}
            </div>
            <div class="visitor-name">${v.blurred ? '· · ·' : v.name}</div>
          </div>`).join('')}
      </div>
      <button class="visitors-unlock-btn" onclick="unlockVisitors()">
        🔓 Voir les ${total} personnes qui vous ont vu — €2.99
      </button>
    </div>`;
}

function unlockVisitors() {
  if (typeof openPayment === 'function') openPayment('Voir mes visiteurs', '2.99');
}

// ═══════════════════════════════════════════════════════
//  HAPPY HOUR — Événement à durée limitée
// ═══════════════════════════════════════════════════════
let happyHourSecs = 1*3600 + 47*60 + 30; // 1h47 remaining
let happyHourInterval = null;

function renderHappyHour() {
  const wrap = document.getElementById('happy-hour-wrap');
  if (!wrap) return;
  const m = Math.floor((happyHourSecs%3600)/60);
  const h = Math.floor(happyHourSecs/3600);
  wrap.innerHTML = `
    <div class="happy-hour" onclick="showToast('🔥 Happy Hour actif — vos likes comptent double !')">
      <div class="hh-icon">🔥</div>
      <div class="hh-body">
        <div class="hh-title">HAPPY HOUR — Likes doublés</div>
        <div class="hh-desc">Chaque like compte double. Profils 3× plus actifs en ce moment !</div>
      </div>
      <div class="hh-timer">
        <div class="hh-timer-num" id="hh-time">${h}:${String(m).padStart(2,'0')}</div>
        <div class="hh-timer-label">restant</div>
      </div>
    </div>`;
  clearInterval(happyHourInterval);
  happyHourInterval = setInterval(() => {
    happyHourSecs = Math.max(0, happyHourSecs-1);
    const el = document.getElementById('hh-time');
    if (!el) { clearInterval(happyHourInterval); return; }
    const h2 = Math.floor(happyHourSecs/3600);
    const m2 = Math.floor((happyHourSecs%3600)/60);
    el.textContent = `${h2}:${String(m2).padStart(2,'0')}`;
  }, 60000); // update each minute
}

// ═══════════════════════════════════════════════════════
//  DAILY REWARD — Récompense quotidienne
// ═══════════════════════════════════════════════════════
const DAILY_PRIZES = [
  { icon:'💫', text:'1 Super-Match offert' },
  { icon:'⚡', text:'1 Spark Boost offert' },
  { icon:'👻', text:'Mode Fantôme 24h' },
  { icon:'⚡', text:'1 Spark Boost offert' },
  { icon:'📸', text:'1 Album Unlock' },
  { icon:'💫', text:'2 Super-Match offerts' },
  { icon:'🎁', text:'Pack surprise premium' },
];
const DAILY_CURRENT = 3; // day 3 (index 2)
let dailyClaimed = false;

function maybeShowDailyReward() {
  // Only show once per "session"
  if (window._dailyShown) return;
  window._dailyShown = true;
  const modal = document.getElementById('daily-reward-modal');
  if (!modal) return;

  // Build days row
  const row = document.getElementById('dr-days-row');
  if (row) {
    row.innerHTML = DAILY_PRIZES.map((p, i) => {
      const claimed = i < DAILY_CURRENT - 1;
      const today = i === DAILY_CURRENT - 1;
      return `<div class="dr-day ${claimed?'claimed':''} ${today?'today':''}">
        <span class="dr-day-num">J${i+1}</span>
        ${claimed ? '✓' : p.icon}
      </div>`;
    }).join('');
  }
  // Today's prize
  const prize = DAILY_PRIZES[DAILY_CURRENT-1];
  document.getElementById('dr-day-badge').textContent = 'Jour ' + DAILY_CURRENT;
  document.getElementById('dr-prize-icon').textContent = prize.icon;
  document.getElementById('dr-prize-text').textContent = prize.text;
  const next = DAILY_PRIZES[DAILY_CURRENT] || DAILY_PRIZES[0];
  document.getElementById('dr-next-hint').textContent = 'Demain : ' + next.text + ' ' + next.icon;

  modal.classList.add('active');
}

function claimDailyReward() {
  if (dailyClaimed) return;
  dailyClaimed = true;
  spawnConfetti();
  const prize = DAILY_PRIZES[DAILY_CURRENT-1];
  document.getElementById('daily-reward-modal').classList.remove('active');
  setTimeout(() => showToast('🎁 ' + prize.text + ' ajouté à votre compte !'), 300);
  // Add notification
  NOTIFICATIONS.unshift({ id:Date.now(), type:'boost', unread:true, icon:prize.icon,
    text:'Cadeau du jour récupéré : <strong>'+prize.text+'</strong>', time:'À l\'instant' });
  renderNotifications();
}

function spawnConfetti() {
  const colors = ['#d45177','#e86e90','#c9a46a','#4dbb88','#9b6dd4','#4dbdb6'];
  for (let i=0; i<40; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = Math.random()*100 + 'vw';
    c.style.background = colors[Math.floor(Math.random()*colors.length)];
    c.style.animationDelay = Math.random()*0.3 + 's';
    c.style.borderRadius = Math.random()>0.5 ? '50%' : '2px';
    document.body.appendChild(c);
    setTimeout(()=>c.remove(), 1500);
  }
}

// ═══════════════════════════════════════════════════════
//  PROFILE COMPLETION + BADGES
// ═══════════════════════════════════════════════════════
const PROFILE_COMPLETION = 60; // %
const COMPLETION_STEPS = [
  { done:true,  label:'Photo de profil' },
  { done:true,  label:'Bio rédigée' },
  { done:true,  label:'Orientation' },
  { done:false, label:'VoiceBio (15s)' },
  { done:false, label:'Vérification photo' },
];

function renderProfileCompletion() {
  const wrap = document.getElementById('profile-completion-wrap');
  if (!wrap) return;
  const circumference = 2 * Math.PI * 28;
  const offset = circumference - (PROFILE_COMPLETION/100) * circumference;
  const nextStep = COMPLETION_STEPS.find(s => !s.done);
  wrap.innerHTML = `
    <div class="completion-card">
      <div class="completion-ring">
        <svg width="64" height="64">
          <circle class="completion-ring-bg" cx="32" cy="32" r="28"></circle>
          <circle class="completion-ring-fill" cx="32" cy="32" r="28"
            stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
        </svg>
        <div class="completion-pct">${PROFILE_COMPLETION}%</div>
      </div>
      <div class="completion-info">
        <div class="completion-title">Complétez votre profil</div>
        <div class="completion-sub">Les profils complets reçoivent <strong>4× plus de matchs</strong>.</div>
        ${nextStep ? `<span class="completion-next" onclick="showToast('📝 Ajoutez : ${nextStep.label}')">+ ${nextStep.label}</span>` : ''}
      </div>
    </div>`;
}

const PROFILE_BADGES_LIST = [
  { icon:'🌸', label:'Premier match', earned:true },
  { icon:'🗝️', label:'Chambre', earned:true },
  { icon:'🔥', label:'Série 3j', earned:true },
  { icon:'✓',  label:'Vérifié', earned:false },
  { icon:'⚡', label:'Booster', earned:false },
  { icon:'💬', label:'Bavard', earned:true },
  { icon:'🏆', label:'Top 10', earned:false },
  { icon:'💎', label:'Premium', earned:false },
];

function renderProfileBadges() {
  const wrap = document.getElementById('profile-badges-wrap');
  if (!wrap) return;
  const earned = PROFILE_BADGES_LIST.filter(b=>b.earned).length;
  wrap.innerHTML = `
    <div class="badges-showcase">
      <div class="badges-showcase-title">Badges · ${earned}/${PROFILE_BADGES_LIST.length} débloqués</div>
      <div class="badges-grid">
        ${PROFILE_BADGES_LIST.map(b => `
          <div class="badge-item ${b.earned?'earned':''}">
            <div class="badge-circle ${b.earned?'earned':'locked'}">${b.icon}</div>
            <div class="badge-label">${b.label}</div>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── CTA tracking ──────────────────────────────────────────────
function trackCTALegacy(source) {
  console.log('[trio] CTA:', source);
}

// ══════════════════════════════════════════════════════════════
//  UPLOAD PHOTOS & PROFIL ÉDITABLE
// ══════════════════════════════════════════════════════════════

let photoUploadSlot = 1;

function triggerPhotoUpload(slot) {
  photoUploadSlot = slot;
  const input = document.getElementById('photo-upload-input');
  if (input) input.click();
}

async function handlePhotoSelected(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) { showToast('❌ Photo trop lourde (max 5 Mo)'); return; }
  if (!['image/jpeg','image/png','image/webp'].includes(file.type)) {
    showToast('❌ Format non supporté (JPG, PNG ou WebP)'); return;
  }

  // Prévisualisation immédiate
  const reader = new FileReader();
  reader.onload = (e) => {
    const slot = photoUploadSlot;
    const img = document.getElementById(`photo-preview-${slot}`);
    const empty = document.getElementById(`slot-${slot}-empty`);
    const slotEl = document.getElementById(`slot-${slot}`);
    if (img) { img.src = e.target.result; img.style.display = 'block'; }
    if (empty) empty.style.display = 'none';
    if (slotEl) slotEl.classList.add('has-photo');
    if (slot === 1) {
      const avImg = document.getElementById('profile-av-img');
      const avText = document.getElementById('profile-av-text');
      if (avImg) { avImg.src = e.target.result; avImg.style.display = 'block'; }
      if (avText) avText.style.display = 'none';
    }
  };
  reader.readAsDataURL(file);

  // Upload Supabase
  if (typeof uploadProfilePhoto === 'function') {
    const slotEl = document.getElementById(`slot-${photoUploadSlot}`);
    if (slotEl) slotEl.classList.add('uploading');
    const url = await uploadProfilePhoto(file, photoUploadSlot);
    if (slotEl) slotEl.classList.remove('uploading');
    if (url) showToast('✅ Photo enregistrée !');
  } else {
    showToast('📸 Photo ajoutée (demo)');
  }
  event.target.value = '';
}

function updateBioCount(el) {
  const count = document.getElementById('bio-count');
  if (count) count.textContent = el.value.length + '/300';
}

async function saveBio() {
  const bio = document.getElementById('bio-input')?.value?.trim();
  if (!bio) return;
  if (typeof updateMyProfile === 'function') {
    await updateMyProfile({ bio });
    showToast('✅ Bio enregistrée !');
  } else {
    showToast('✅ Bio sauvegardée (demo)');
  }
}

function hydrateProfileTab(profile) {
  if (!profile) return;
  const nameEl = document.getElementById('profile-display-name');
  if (nameEl) nameEl.textContent = profile.prenom + ', ' + profile.age;

  if (profile.photo_url) {
    const img1 = document.getElementById('photo-preview-1');
    const empty1 = document.getElementById('slot-1-empty');
    const slot1 = document.getElementById('slot-1');
    const avImg = document.getElementById('profile-av-img');
    const avText = document.getElementById('profile-av-text');
    if (img1) { img1.src = profile.photo_url; img1.style.display = 'block'; }
    if (empty1) empty1.style.display = 'none';
    if (slot1) slot1.classList.add('has-photo');
    if (avImg) { avImg.src = profile.photo_url; avImg.style.display = 'block'; }
    if (avText) avText.style.display = 'none';
  }
  if (profile.photo2_url) {
    const img2 = document.getElementById('photo-preview-2');
    const empty2 = document.getElementById('slot-2-empty');
    const slot2 = document.getElementById('slot-2');
    if (img2) { img2.src = profile.photo2_url; img2.style.display = 'block'; }
    if (empty2) empty2.style.display = 'none';
    if (slot2) slot2.classList.add('has-photo');
  }
  const bioInput = document.getElementById('bio-input');
  if (bioInput && profile.bio) { bioInput.value = profile.bio; updateBioCount(bioInput); }

  const verifiedTag = document.getElementById('profile-verified-tag');
  if (verifiedTag) {
    verifiedTag.textContent = profile.is_verified ? '✓ Vérifié' : 'Non vérifié';
    if (profile.is_verified) verifiedTag.style.color = 'var(--teal)';
  }
}



// ═══════════════════════════════════════════════════════
//  ADMIN
// ═══════════════════════════════════════════════════════
const ADMIN_CREDS = { user: 'trio_admin', pass: 'Tr!0@2026#Secure' };

// ── Accès créateur — clé secrète (ne pas partager) ───────────
const CREATOR_KEY = 'trio-fondateur-2026';

const ADMIN_USERS = [
  { id:1, name:'Camille M.', city:'Paris', type:'solo', verified:true, status:'active', joined:'12/06/2026', photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=70' },
  { id:2, name:'Marco D.', city:'Lyon', type:'solo', verified:true, status:'active', joined:'10/06/2026', photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70' },
  { id:3, name:'Sofia & Antoine', city:'Paris', type:'duo', verified:true, status:'active', joined:'08/06/2026', photo:'https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=80&q=70' },
  { id:4, name:'Léa B.', city:'Bordeaux', type:'solo', verified:false, status:'active', joined:'11/06/2026', photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=70' },
  { id:5, name:'Théo R.', city:'Marseille', type:'solo', verified:true, status:'active', joined:'09/06/2026', photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70' },
  { id:6, name:'Compte #619', city:'—', type:'solo', verified:false, status:'flagged', joined:'07/06/2026', photo:'' },
];
const ADMIN_REPORTS = [
  { id:1, type:'harassment', label:'Harcèlement', reporter:'Camille M.', reported:'Compte #284', desc:'Messages répétés après refus explicite. 6 messages en 2h sans réponse.', time:'Il y a 42 min', urgent:true },
  { id:2, type:'fake', label:'Faux profil', reporter:'Marco D.', reported:'Compte #619', desc:'Photos volées sur Instagram, profil incohérent. Répond en anglais uniquement.', time:'Il y a 2h', urgent:false },
  { id:3, type:'content', label:'Contenu inapproprié', reporter:'Léa B.', reported:'Compte #872', desc:'Photo de profil principale ne respecte pas les CGU.', time:'Il y a 4h', urgent:false },
];
const ADMIN_BESTSELLERS = [
  { name:'Spark Boost', count:94, amount:'€280.86' },
  { name:'Super-Match', count:67, amount:'€99.83' },
  { name:'Pack Boost x3', count:31, amount:'€216.69' },
  { name:'Album Unlock', count:28, amount:'€55.72' },
  { name:'Mode Fantôme XL', count:19, amount:'€75.81' },
];
const ADMIN_TRANSACTIONS = [
  { icon:'⚡', name:'Spark Boost', user:'Camille M.', amount:'+€2.99', time:'14:32' },
  { icon:'💫', name:'Super-Match', user:'Marco D.', amount:'+€1.49', time:'14:18' },
  { icon:'⚡', name:'Pack Boost x3', user:'Sofia & Antoine', amount:'+€6.99', time:'13:55' },
  { icon:'📸', name:'Album Unlock', user:'Léa B.', amount:'+€1.99', time:'13:40' },
  { icon:'⚡', name:'Spark Boost', user:'Théo R.', amount:'+€2.99', time:'13:12' },
];
const ADMIN_ACTIVITY = [
  { col:'var(--green)', text:'Nouvelle inscription — Chloé V., Paris', time:'Il y a 3 min' },
  { col:'var(--rose)', text:'Match confirmé — Profil #142 × Duo #38', time:'Il y a 8 min' },
  { col:'var(--gold)', text:'Achat Spark Boost — Camille M.', time:'Il y a 14 min' },
  { col:'#e05555', text:'Signalement reçu — Harcèlement (prioritaire)', time:'Il y a 42 min' },
  { col:'var(--teal)', text:'Profil vérifié — Marco D., Lyon', time:'Il y a 1h' },
  { col:'var(--violet)', text:'Profil Duo créé — Sofia & Antoine', time:'Il y a 2h' },
  { col:'var(--green)', text:'+12 nouvelles inscriptions aujourd\'hui', time:'Aujourd\'hui' },
];
const ADMIN_CONTENT_QUEUE = [
  { photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&q=70', user:'Utilisateur #1284', desc:'Photo de profil principale', time:'Il y a 18 min' },
  { photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=70', user:'Utilisateur #947', desc:'Photo album privé n°3', time:'Il y a 1h' },
  { photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=120&q=70', user:'Utilisateur #2031', desc:'Photo de profil principale', time:'Il y a 2h' },
];

function openAdminLogin() {
  // In app.html context
  const o = document.getElementById('admin-login-overlay');
  o.style.display = 'flex';
  setTimeout(()=>document.getElementById('admin-user').focus(), 100);
}
function closeAdminLogin() {
  document.getElementById('admin-login-overlay').style.display = 'none';
  document.getElementById('admin-login-error').style.display = 'none';
  document.getElementById('admin-user').value = '';
  document.getElementById('admin-pass').value = '';
}
function tryAdminLogin() {
  const u = document.getElementById('admin-user').value.trim();
  const p = document.getElementById('admin-pass').value;
  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    closeAdminLogin();
    openAdminDashboard();
  } else {
    document.getElementById('admin-login-error').style.display = 'block';
    document.getElementById('admin-pass').value = '';
    setTimeout(()=>document.getElementById('admin-login-error').style.display='none', 3000);
  }
}
function openAdminDashboard() {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  // no landing in app.html
  document.getElementById('main-app').classList.remove('active');
  const dash = document.getElementById('screen-admin');
  dash.style.display = 'flex';
  renderActivity(); renderUsers(ADMIN_USERS); renderReports(); renderRevenue(); renderContentQueue();
}
function logoutAdmin() {
  document.getElementById('screen-admin').style.display = 'none';
  document.getElementById('screen-landing').classList.add('active');
  window.scrollTo(0,0);
}
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.admin-pane').forEach(p=>p.classList.remove('active'));
  document.querySelector('[data-atab="'+tab+'"]').classList.add('active');
  document.getElementById('atab-'+tab).classList.add('active');
}
function showAdminToast(msg) {
  const t = document.getElementById('admin-toast');
  t.textContent = msg; t.style.display = 'block';
  clearTimeout(window._aToast);
  window._aToast = setTimeout(()=>t.style.display='none', 3000);
}
function toggleAdminSetting(id) {
  document.getElementById(id).classList.toggle('active');
  showAdminToast('Paramètre mis à jour');
}
function renderActivity() {
  document.getElementById('activity-feed').innerHTML = ADMIN_ACTIVITY.map(a=>
    '<div class="activity-item"><div class="activity-dot" style="background:'+a.col+'"></div><div class="activity-text">'+a.text+'</div><div class="activity-time">'+a.time+'</div></div>'
  ).join('');
}
let _allUsers = ADMIN_USERS.map(u=>Object.assign({},u));
function renderUsers(users) {
  const cols = '40px 1fr 90px 70px 80px 100px';
  document.getElementById('users-table').innerHTML =
    '<div class="admin-table">' +
    '<div class="admin-table-header" style="grid-template-columns:'+cols+';"><div></div><div>Membre</div><div>Ville</div><div>Type</div><div>Statut</div><div>Actions</div></div>' +
    users.map(function(u) {
      var av = u.photo
        ? '<img src="'+u.photo+'" alt="" style="width:100%;height:100%;object-fit:cover;">'
        : '<div style="width:100%;height:100%;background:var(--s3);display:flex;align-items:center;justify-content:center;font-size:14px;">👤</div>';
      var verified = u.verified ? ' · <span style="color:var(--teal);">✓</span>' : '';
      var typeBadge = u.type==='duo' ? '<span class="user-badge badge-duo">💑 Duo</span>' : '<span class="user-badge badge-solo">Solo</span>';
      var statusBadge = u.status==='flagged'
        ? '<span class="user-badge badge-flagged">🚨 Signalé</span>'
        : '<span class="user-badge badge-verified">Actif</span>';
      return '<div class="admin-table-row" style="grid-template-columns:'+cols+';">'+
        '<div class="user-av">'+av+'</div>'+
        '<div><div class="user-name">'+u.name+'</div><div class="user-meta">Inscrit le '+u.joined+verified+'</div></div>'+
        '<div style="font-size:12px;color:var(--text3);">'+u.city+'</div>'+
        '<div>'+typeBadge+'</div>'+
        '<div>'+statusBadge+'</div>'+
        '<div style="display:flex;gap:5px;">'+
          '<button class="action-btn-sm" onclick="showAdminToast(\'👤 Profil ouvert\')">Voir</button>'+
          '<button class="action-btn-sm danger" onclick="banUser('+u.id+')">Bannir</button>'+
        '</div></div>';
    }).join('') +
    '</div><div style="margin-top:8px;font-size:11px;color:var(--text3);">'+users.length+' membre'+(users.length>1?'s':'')+' affiché'+(users.length>1?'s':'')+'</div>';
}
function filterUsers(q) {
  var f = q.toLowerCase();
  renderUsers(_allUsers.filter(function(u){ return u.name.toLowerCase().includes(f)||u.city.toLowerCase().includes(f); }));
}
function filterUsersByType(type) {
  renderUsers(type==='all' ? _allUsers : _allUsers.filter(function(u){ return u.status===type||u.type===type; }));
}
function banUser(id) {
  var u = _allUsers.find(function(x){ return x.id===id; });
  if(!u) return;
  if(confirm('Bannir '+u.name+' définitivement ?')) {
    _allUsers = _allUsers.filter(function(x){ return x.id!==id; });
    renderUsers(_allUsers);
    showAdminToast('🚫 '+u.name+' a été banni');
  }
}
function renderReports() {
  var typeMap = { harassment:'rt-harassment', fake:'rt-fake', content:'rt-content' };
  document.getElementById('reports-list').innerHTML = ADMIN_REPORTS.map(function(r){
    return '<div class="report-card'+(r.urgent?' urgent':'')+'">'+
      '<div class="report-header"><span class="report-type '+typeMap[r.type]+'">'+(r.urgent?'🔴 ':'')+r.label+'</span><span class="report-time">'+r.time+'</span></div>'+
      '<div class="report-body"><strong style="color:var(--text);">Signalé par :</strong> '+r.reporter+' → '+r.reported+'<br><span style="margin-top:4px;display:block;">'+r.desc+'</span></div>'+
      '<div class="report-actions">'+
        '<button class="action-btn-sm" onclick="showAdminToast(\'👁 Profil ouvert\')">Voir profil</button>'+
        '<button class="action-btn-sm danger" onclick="showAdminToast(\'🚫 Compte suspendu\')">Suspendre</button>'+
        '<button class="action-btn-sm" onclick="showAdminToast(\'✅ Résolu\')" style="color:var(--green);border-color:rgba(77,187,136,.3);">Résoudre</button>'+
      '</div></div>';
  }).join('');
}
function renderRevenue() {
  var max = ADMIN_BESTSELLERS[0].count;
  document.getElementById('bestsellers').innerHTML = ADMIN_BESTSELLERS.map(function(b){
    return '<div class="bs-item"><div class="bs-name">'+b.name+'</div><div class="bs-count">'+b.count+'×</div>'+
      '<div class="bs-bar-wrap"><div class="bs-bar" style="width:'+(b.count/max*100)+'%"></div></div>'+
      '<div class="bs-amount">'+b.amount+'</div></div>';
  }).join('');
  document.getElementById('transactions').innerHTML = ADMIN_TRANSACTIONS.map(function(t){
    return '<div class="tx-item"><div class="tx-icon">'+t.icon+'</div><div><div class="tx-name">'+t.name+'</div><div class="tx-user">'+t.user+'</div></div>'+
      '<div class="tx-amount">'+t.amount+'</div><div class="tx-time">'+t.time+'</div></div>';
  }).join('');
}
function renderContentQueue() {
  document.getElementById('content-queue').innerHTML = ADMIN_CONTENT_QUEUE.map(function(item){
    return '<div class="content-card">'+
      '<div class="content-thumb"><img src="'+item.photo+'" alt="" style="width:100%;height:100%;object-fit:cover;"></div>'+
      '<div style="flex:1"><div style="font-size:13px;color:var(--text);font-weight:500;">'+item.user+'</div>'+
      '<div style="font-size:11px;color:var(--text3);margin-top:2px;">'+item.desc+'</div>'+
      '<div style="font-size:10px;color:var(--text3);margin-top:4px;">⏱ '+item.time+'</div></div>'+
      '<div style="display:flex;flex-direction:column;gap:6px;">'+
        '<button class="action-btn-sm" style="color:var(--green);border-color:rgba(77,187,136,.3);" onclick="showAdminToast(\'✅ Photo approuvée\')">✓ Valider</button>'+
        '<button class="action-btn-sm danger" onclick="showAdminToast(\'🗑 Photo supprimée\')">✕ Refuser</button>'+
      '</div></div>';
  }).join('');
}



// ═══════════════════════════════════════════════════════
//  LA CHAMBRE SECRÈTE — Engine
// ═══════════════════════════════════════════════════════
var CHAMBER_WEEKS = [{
  id:1, theme:"Le Manuscrit Disparu", emoji:"📜",
  narrative:"Un manuscrit du XIIe siècle a disparu de la bibliothèque de Venise. Chaque indice vous rapproche de l'identité du voleur. Seuls les plus perspicaces accèderont au Salon.",
  cover:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=700&q=80",
  enigmas:[
    {id:'e1',type:'Logique',label:'Énigme I',img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=70",
     question:"Je suis grand le matin, petit à midi, et grand à nouveau le soir. Qu'est-ce que je suis ?",
     kind:'text',answer:'ombre',hint:"Regardez ce que produit le soleil quand il éclaire un objet…",
     narrative_after:"La première porte s'ouvre. Dans la pièce : une ombre projetée sur le mur forme le mot suivant…"},
    {id:'e2',type:'Culture',label:'Énigme II',img:"https://images.unsplash.com/photo-1461360228754-6e81c478b882?w=500&q=70",
     question:"Quel auteur a écrit « Je pense, donc je suis » ?",
     kind:'mcq',options:['Voltaire','Descartes','Rousseau','Pascal'],answer:'Descartes',
     hint:"Un philosophe français du XVIIe siècle, fondateur de la géométrie analytique…",
     narrative_after:"Vous trouvez une note signée R.D. La piste s'épaissit."},
    {id:'e3',type:'Chiffrement',label:'Énigme III',img:"https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&q=70",
     question:"Déchiffrez ce code César (décalage de 3) :",cipher:"FRQQHFWLRQ",
     kind:'cipher',answer:'connexion',hint:"Chaque lettre est décalée de 3 positions en arrière. F→C, R→O…",
     narrative_after:"Le mot était CONNEXION. Le voleur laisse des connexions derrière lui."},
    {id:'e4',type:'Logique',label:'Énigme IV',img:"https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&q=70",
     question:"5 étagères. La 1re = 2× la 5e. La 3e = 15. La 5e = 10. La 2e = la 4e. Total = 80. Combien la 2e ?",
     kind:'text',answer:'12',hint:"1re=20, 3e=15, 5e=10 → total=45. Restant=35 pour 2e+4e. Divisez par 2.",
     narrative_after:"La bibliothèque révèle sa structure. L'étagère 2 et 4 cachent le même secret."},
    {id:'e5',type:'Intuition',label:'Énigme Finale',img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=70",
     question:"Trio sans toi, c'est quoi ?",
     kind:'mcq',options:['Une paire','Un duo','Un vide','Rien'],answer:'Un vide',
     hint:"Pensez à ce que vous cherchez sur cette application…",
     narrative_after:"Vous avez compris. Le manuscrit révèle son dernier secret : la connexion manquante, c'était vous."}
  ]
}];

var SALON_SOLVERS=[
  {name:'Camille',time:'4:32',photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=70'},
  {name:'Marco',time:'7:18',photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70'},
  {name:'Sofia',time:'9:44',photo:'https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=80&q=70'},
  {name:'Léa',time:'11:02',photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=70'}
];
var LEADERBOARD=[
  {name:'Camille M.',time:'4:32',photo:'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=70'},
  {name:'Marco D.',time:'7:18',photo:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70'},
  {name:'Sofia V.',time:'9:44',photo:'https://images.unsplash.com/photo-1522098543979-ffc7f79a56c4?w=80&q=70'},
  {name:'Léa B.',time:'11:02',photo:'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=80&q=70'},
  {name:'Théo R.',time:'14:27',photo:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=70'}
];

var CS={currentEnigma:0,solved:[],hintsUsed:0,startTime:null,selectedOption:null,completed:false,timerItv:null,cdItv:null};

function renderChamber(){
  var week=CHAMBER_WEEKS[0];
  var root=document.getElementById('chamber-root');
  if(!root) return;
  if(CS.completed){renderSalon(root,week);return;}
  if(CS.solved.length===0){renderLobby(root,week);}
  else{renderEnigma(root,week);}
}

function renderLobby(root,week){
  root.innerHTML='<div style="text-align:center;padding:8px 0 20px;">'+
    '<span style="font-size:52px;display:block;margin-bottom:10px;animation:flicker 4s infinite;">'+week.emoji+'</span>'+
    '<div class="ch-week-badge"><div class="ch-week-dot"></div>Semaine #1 · Nouveau</div>'+
    '<h2 class="ch-title">'+week.theme+'</h2>'+
    '<p class="ch-sub">'+week.narrative+'</p>'+
    '<div class="ch-timer-wrap">'+
      '<div class="ch-timer-block"><span class="ch-timer-num" id="ct-h">47</span><span class="ch-timer-label">heures</span></div>'+
      '<span class="ch-timer-sep">:</span>'+
      '<div class="ch-timer-block"><span class="ch-timer-num" id="ct-m">38</span><span class="ch-timer-label">minutes</span></div>'+
      '<span class="ch-timer-sep">:</span>'+
      '<div class="ch-timer-block"><span class="ch-timer-num" id="ct-s">12</span><span class="ch-timer-label">secondes</span></div>'+
    '</div>'+
    '<div style="font-size:10px;color:var(--text3);margin-bottom:18px;margin-top:-10px;">⏳ Avant la prochaine Chambre</div>'+
    '<div class="ch-live-bar">'+
      '<div class="ch-avatars-mini">'+SALON_SOLVERS.map(function(s){return '<div class="ch-av-mini"><img src="'+s.photo+'" style="width:100%;height:100%;object-fit:cover;"></div>';}).join('')+'</div>'+
      '<span><strong id="live-solving">23</strong> personnes résolvent en ce moment</span>'+
    '</div>'+
    '<div style="border-radius:18px;overflow:hidden;margin-bottom:18px;position:relative;">'+
      '<img src="'+week.cover+'" style="width:100%;height:180px;object-fit:cover;filter:brightness(.45) saturate(1.3);">'+
      '<div style="position:absolute;inset:0;background:linear-gradient(to top,var(--bg) 0%,transparent 55%);"></div>'+
      '<div style="position:absolute;bottom:16px;left:0;right:0;text-align:center;">'+
        '<div style="font-family:var(--ff);font-size:22px;font-style:italic;color:var(--text);">5 énigmes · ~15 minutes</div>'+
        '<div style="font-size:11px;color:var(--text3);margin-top:4px;">Difficulté progressive · Salon exclusif à la clé</div>'+
      '</div>'+
    '</div>'+
    '<div style="background:var(--s2);border-radius:16px;border:1px solid var(--border);padding:16px;margin-bottom:18px;text-align:left;">'+
      '<div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:12px;">Ce qui vous attend</div>'+
      [['🧩','Logique & déduction','Énigmes de raisonnement pur'],['📚','Culture générale','Histoire, sciences, arts'],['🔐','Cryptographie','Codes à déchiffrer'],['👁','Observation','Ce que les autres ne voient pas'],['💫','Question secrète','Révélée aux initiés']].map(function(x){
        return '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">'+
          '<span style="font-size:18px;flex-shrink:0;">'+x[0]+'</span>'+
          '<div><div style="font-size:12px;color:var(--text);font-weight:600;">'+x[1]+'</div><div style="font-size:11px;color:var(--text3);">'+x[2]+'</div></div></div>';
      }).join('')+
    '</div>'+
    '<div style="margin-bottom:18px;">'+
      '<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">🏆 Classement actuel</div>'+
      LEADERBOARD.map(function(lb,i){
        return '<div class="ch-lb-item">'+
          '<div class="ch-lb-rank '+(i===0?'gold-rank':i===1?'silver-rank':i===2?'bronze-rank':'')+'">'+(i===0?'👑':i+1)+'</div>'+
          '<div class="ch-lb-av"><img src="'+lb.photo+'" style="width:100%;height:100%;object-fit:cover;"></div>'+
          '<div class="ch-lb-name">'+lb.name+'</div>'+
          '<div class="ch-lb-time">⏱ '+lb.time+'</div></div>';
      }).join('')+
    '</div>'+
    '<button class="ch-validate" onclick="startChamber()">🗝️ Entrer dans la Chambre →</button>'+
    '<p style="font-size:11px;color:var(--text3);margin-top:8px;">Le salon s\'efface dans 48h après votre entrée</p>'+
  '</div>';
  startCountdown(47,38,12);
  startLiveCounter();
}

function renderEnigma(root,week){
  var enigma=week.enigmas[CS.currentEnigma];
  var total=week.enigmas.length;
  var elapsed=CS.startTime?Math.floor((Date.now()-CS.startTime)/1000):0;
  var mins=String(Math.floor(elapsed/60)).padStart(2,'0');
  var secs=String(elapsed%60).padStart(2,'0');
  var letters=['A','B','C','D'];

  var progressHtml=Array.from({length:total},function(_,i){
    var cls=i<CS.currentEnigma?'done':i===CS.currentEnigma?'active':'';
    return (i>0?'<div class="ch-prog-line '+(i<=CS.currentEnigma?'done':'')+'"></div>':'')+
      '<div class="ch-prog-step '+cls+'">'+(i<CS.currentEnigma?'✓':i+1)+'</div>';
  }).join('');

  var answerHtml='';
  if(enigma.kind==='text'){
    answerHtml='<div class="ch-answer-wrap"><input class="ch-answer" id="ch-ans" type="text" placeholder="Votre réponse…" onkeydown="if(event.key===\'Enter\')checkAnswer()" oninput="updateValidateBtn()"><span class="ch-answer-icon" id="ch-ans-icon"></span></div>';
  } else if(enigma.kind==='cipher'){
    answerHtml='<div class="cipher-wrap">'+enigma.cipher+'</div><div class="ch-answer-wrap"><input class="ch-answer" id="ch-ans" type="text" placeholder="Mot déchiffré…" onkeydown="if(event.key===\'Enter\')checkAnswer()" oninput="updateValidateBtn()"><span class="ch-answer-icon" id="ch-ans-icon"></span></div>';
  } else if(enigma.kind==='mcq'){
    answerHtml='<div class="ch-options" id="ch-opts">'+enigma.options.map(function(opt,i){
      return '<button class="ch-option" id="opt-'+i+'" onclick="selectOption(\''+opt+'\','+i+')"><div class="ch-option-letter">'+letters[i]+'</div>'+opt+'</button>';
    }).join('')+'</div>';
  }

  var prevNarrative='';
  if(CS.currentEnigma>0 && week.enigmas[CS.currentEnigma-1]){
    prevNarrative='<div class="ch-narrative">"'+week.enigmas[CS.currentEnigma-1].narrative_after+'"</div>';
  }

  root.innerHTML='<div>'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">'+
      '<div style="font-family:var(--ff);font-size:17px;font-style:italic;color:var(--text);">'+week.theme+'</div>'+
      '<div style="font-size:12px;color:var(--teal);font-weight:600;" id="ch-elapsed">⏱ '+mins+':'+secs+'</div>'+
    '</div>'+
    '<div class="ch-progress">'+progressHtml+'</div>'+
    prevNarrative+
    '<div class="ch-enigma-card">'+
      '<div class="ch-enigma-img-wrap"><img class="ch-enigma-img" src="'+enigma.img+'"></div>'+
      '<div class="ch-enigma-header"><span class="ch-enigma-type">'+enigma.type+'</span><span class="ch-enigma-num">'+enigma.label+' / '+total+'</span></div>'+
      '<div class="ch-enigma-body">'+
        '<div class="ch-enigma-q">'+enigma.question+'</div>'+
        answerHtml+
        '<div class="ch-hint-box" id="ch-hint">'+enigma.hint+'</div>'+
      '</div>'+
    '</div>'+
    '<div style="display:flex;gap:10px;margin-bottom:12px;align-items:center;">'+
      '<button class="ch-hint-btn" onclick="showHint()">💡 Indice '+(CS.hintsUsed>0?'('+CS.hintsUsed+' utilisé'+(CS.hintsUsed>1?'s':'')+')'  :'')+'</button>'+
      '<div style="flex:1;font-size:11px;color:var(--text3);text-align:right;">'+CS.currentEnigma+'/'+total+' résolues</div>'+
    '</div>'+
    '<button class="ch-validate" id="ch-validate-btn" onclick="checkAnswer()" disabled>Valider →</button>'+
    '<button onclick="abandonChamber()" style="width:100%;padding:10px;margin-top:8px;background:transparent;border:none;font-size:11px;color:var(--text3);cursor:pointer;">Quitter la Chambre</button>'+
  '</div>';

  startElapsedTimer();
}

function renderSalon(root,week){
  var elapsed=CS.startTime?Math.floor((Date.now()-CS.startTime)/1000):0;
  var mins=String(Math.floor(elapsed/60)).padStart(2,'0');
  var secs=String(elapsed%60).padStart(2,'0');
  var myRank=LEADERBOARD.length+1;

  root.innerHTML='<div>'+
    '<div class="ch-success">'+
      '<span class="ch-success-icon">🗝️</span>'+
      '<h2 class="ch-success-title">Vous avez trouvé !</h2>'+
      '<p style="font-size:13px;color:var(--text3);margin-bottom:4px;">Temps : <strong style="color:var(--teal);">'+mins+':'+secs+'</strong> · Indices : <strong style="color:var(--gold);">'+CS.hintsUsed+'</strong></p>'+
      '<p style="font-size:13px;color:var(--text3);">Classement : <strong style="color:var(--rose);">#'+myRank+'</strong></p>'+
    '</div>'+
    '<div class="ch-narrative">"'+week.enigmas[week.enigmas.length-1].narrative_after+'"</div>'+
    '<div class="ch-salon-card">'+
      '<div class="ch-salon-title">🚪 Le Salon des Initiés</div>'+
      '<div class="ch-salon-sub">Vous rejoignez les '+SALON_SOLVERS.length+' personnes qui ont résolu cette Chambre. Ce salon disparaît dans <strong style="color:var(--rose);">47h 38m</strong>.</div>'+
      '<div class="ch-salon-solvers">'+
        SALON_SOLVERS.map(function(s){return '<div class="ch-solver-chip"><div class="ch-solver-av"><img src="'+s.photo+'" style="width:100%;height:100%;object-fit:cover;border-radius:50%;"></div><div><div class="ch-solver-name">'+s.name+'</div><div class="ch-solver-time">⏱ '+s.time+'</div></div></div>';}).join('')+
        '<div class="ch-solver-chip" style="border-color:var(--rose);background:rgba(212,81,119,.1);">'+
          '<div style="width:22px;height:22px;border-radius:50%;background:var(--rose);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;font-weight:700;">Moi</div>'+
          '<div><div class="ch-solver-name" style="color:var(--rose);">Vous</div><div class="ch-solver-time">'+mins+':'+secs+'</div></div>'+
        '</div>'+
      '</div>'+
      '<button class="ch-validate" onclick="switchTab(\'discover\');showToast(\'💕 Vous êtes dans le Salon !\')">Voir les profils du Salon →</button>'+
    '</div>'+
    '<div style="text-align:center;margin-top:18px;background:var(--s2);border-radius:16px;border:1px solid var(--border);padding:16px;">'+
      '<div style="font-size:12px;color:var(--text3);margin-bottom:6px;">Comment était cette Chambre ?</div>'+
      '<div class="ch-stars" id="ch-stars">'+[1,2,3,4,5].map(function(i){return '<span class="ch-star" onclick="rateChamber('+i+')">⭐</span>';}).join('')+'</div>'+
      '<div id="ch-rating-msg" style="font-size:12px;color:var(--text3);min-height:18px;"></div>'+
    '</div>'+
    '<div style="margin-top:16px;">'+
      '<div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--text3);margin-bottom:10px;">🏆 Classement</div>'+
      LEADERBOARD.map(function(lb,i){
        return '<div class="ch-lb-item"><div class="ch-lb-rank '+(i===0?'gold-rank':i===1?'silver-rank':i===2?'bronze-rank':'')+'">'+(i===0?'👑':i+1)+'</div><div class="ch-lb-av"><img src="'+lb.photo+'" style="width:100%;height:100%;object-fit:cover;"></div><div class="ch-lb-name">'+lb.name+'</div><div class="ch-lb-time">⏱ '+lb.time+'</div></div>';
      }).join('')+
      '<div class="ch-lb-item" style="border-color:var(--rose);"><div class="ch-lb-rank" style="color:var(--rose);">'+myRank+'</div><div class="ch-lb-av" style="background:var(--rose);display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;font-weight:700;border-radius:50%;">Moi</div><div class="ch-lb-name" style="color:var(--rose);">Vous</div><div class="ch-lb-time">⏱ '+mins+':'+secs+'</div></div>'+
    '</div>'+
    '<button onclick="resetChamber()" style="width:100%;padding:10px;margin-top:14px;background:transparent;border:1px solid var(--border);border-radius:12px;font-size:12px;color:var(--text3);cursor:pointer;">Rejouer cette Chambre</button>'+
  '</div>';
}

function startChamber(){
  CS.startTime=Date.now(); CS.currentEnigma=0; CS.solved=['__started__'];
  clearInterval(CS.cdItv);
  renderChamber();
}

function startElapsedTimer(){
  clearInterval(CS.timerItv);
  CS.timerItv=setInterval(function(){
    if(!CS.startTime) return;
    var e=Math.floor((Date.now()-CS.startTime)/1000);
    var el=document.getElementById('ch-elapsed');
    if(el) el.textContent='⏱ '+String(Math.floor(e/60)).padStart(2,'0')+':'+String(e%60).padStart(2,'0');
  },1000);
}

function startCountdown(h,m,s){
  var total=h*3600+m*60+s;
  clearInterval(CS.cdItv);
  CS.cdItv=setInterval(function(){
    total--;
    if(total<=0){clearInterval(CS.cdItv);return;}
    var rh=Math.floor(total/3600),rm=Math.floor((total%3600)/60),rs=total%60;
    var he=document.getElementById('ct-h'),me=document.getElementById('ct-m'),se=document.getElementById('ct-s');
    if(he) he.textContent=String(rh).padStart(2,'0');
    if(me) me.textContent=String(rm).padStart(2,'0');
    if(se) se.textContent=String(rs).padStart(2,'0');
  },1000);
}

function startLiveCounter(){
  var live=23;
  var itv=setInterval(function(){
    live+=Math.random()>.65?(Math.random()>.5?1:-1):0;
    live=Math.max(18,live);
    var el=document.getElementById('live-solving');
    if(el) el.textContent=live;
    else clearInterval(itv);
  },3500);
}

function selectOption(val,idx){
  CS.selectedOption=val;
  document.querySelectorAll('.ch-option').forEach(function(o){o.classList.remove('selected');});
  var btn=document.getElementById('opt-'+idx);
  if(btn) btn.classList.add('selected');
  var vbtn=document.getElementById('ch-validate-btn');
  if(vbtn) vbtn.disabled=false;
}

function updateValidateBtn(){
  var ans=document.getElementById('ch-ans');
  var btn=document.getElementById('ch-validate-btn');
  if(ans&&btn) btn.disabled=ans.value.trim().length<1;
}

function showHint(){
  var box=document.getElementById('ch-hint');
  if(!box) return;
  box.classList.add('show');
  CS.hintsUsed++;
  showToast('💡 Indice débloqué !');
}

function checkAnswer(){
  var week=CHAMBER_WEEKS[0];
  var enigma=week.enigmas[CS.currentEnigma];
  var userAns='';
  if(enigma.kind==='mcq'){
    userAns=CS.selectedOption||'';
  } else {
    var inp=document.getElementById('ch-ans');
    userAns=inp?inp.value.trim().toLowerCase():'';
  }
  var correct=enigma.kind==='mcq'?userAns===enigma.answer:userAns===enigma.answer.toLowerCase();

  if(correct){
    if(enigma.kind!=='mcq'){
      var inp=document.getElementById('ch-ans');
      if(inp){inp.classList.add('correct');var ic=document.getElementById('ch-ans-icon');if(ic)ic.textContent='✓';}
    } else {
      document.querySelectorAll('.ch-option').forEach(function(o){
        if(o.textContent.trim().includes(enigma.answer)) o.classList.add('correct');
        else if(o.classList.contains('selected')) o.classList.add('wrong');
      });
    }
    spawnParticles();
    CS.solved.push(enigma.id);
    CS.selectedOption=null;
    setTimeout(function(){
      if(CS.currentEnigma<week.enigmas.length-1){CS.currentEnigma++;renderChamber();}
      else{CS.completed=true;clearInterval(CS.timerItv);renderChamber();}
    },900);
  } else {
    if(enigma.kind!=='mcq'){
      var inp=document.getElementById('ch-ans');
      if(inp){
        inp.classList.add('wrong');
        var ic=document.getElementById('ch-ans-icon');if(ic)ic.textContent='✗';
        setTimeout(function(){inp.classList.remove('wrong');if(ic)ic.textContent='';inp.value='';},700);
      }
    } else {
      document.querySelectorAll('.ch-option.selected').forEach(function(o){o.classList.add('wrong');});
      setTimeout(function(){
        document.querySelectorAll('.ch-option').forEach(function(o){o.classList.remove('wrong','selected');});
        CS.selectedOption=null;
        var btn=document.getElementById('ch-validate-btn');if(btn)btn.disabled=true;
      },700);
    }
    showToast('❌ Pas tout à fait… Réessayez !');
  }
}

function spawnParticles(){
  var colors=['var(--rose)','var(--teal)','var(--gold)','#fff'];
  for(var i=0;i<12;i++){
    var p=document.createElement('div');
    var angle=Math.random()*Math.PI*2;
    var dist=60+Math.random()*80;
    p.style.cssText='position:fixed;top:50%;left:50%;width:8px;height:8px;border-radius:50%;'+
      'background:'+colors[Math.floor(Math.random()*colors.length)]+';z-index:9999;pointer-events:none;'+
      '--dx:'+Math.cos(angle)*dist+'px;--dy:'+Math.sin(angle)*dist+'px;'+
      'animation:particleBurst .6s ease forwards;';
    document.body.appendChild(p);
    setTimeout(function(){p.remove();},650);
  }
}

function rateChamber(stars){
  document.querySelectorAll('.ch-star').forEach(function(el,i){el.classList.toggle('lit',i<stars);});
  var msgs=['','C\'est noté, on s\'améliore !','Merci pour votre retour !','Bonne expérience !','Super, on est ravis !','Parfait ! Merci 💕'];
  var msg=document.getElementById('ch-rating-msg');
  if(msg) msg.textContent=msgs[stars]||'';
  showToast('⭐ Note enregistrée — merci !');
}

function abandonChamber(){
  if(confirm('Quitter la Chambre ? Votre progression sera perdue.')){
    CS={currentEnigma:0,solved:[],hintsUsed:0,startTime:null,selectedOption:null,completed:false,timerItv:null,cdItv:null};
    renderChamber();
  }
}

function resetChamber(){
  clearInterval(CS.timerItv);clearInterval(CS.cdItv);
  CS={currentEnigma:0,solved:[],hintsUsed:0,startTime:null,selectedOption:null,completed:false,timerItv:null,cdItv:null};
  renderChamber();
}

// switchTab handles chamber via direct call in main switchTab function
