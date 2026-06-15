// ══════════════════════════════════════════════════════════════
//  TRIO — Intégration Supabase
//  Remplace toute la logique simulée par de vrais appels API
// ══════════════════════════════════════════════════════════════

// ── Config Supabase ────────────────────────────────────────────
const SUPABASE_URL = 'https://ekqknpntnafqketwcbwg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gxFriF94dMjyQRpavZQ9dw_SgO5TUBC';

// ── Init client Supabase ───────────────────────────────────────
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ══════════════════════════════════════════════════════════════
//  AUTHENTIFICATION
// ══════════════════════════════════════════════════════════════

// ── État courant ───────────────────────────────────────────────
let currentUser = null;
let currentProfile = null;

// ── Écoute les changements d'état de session ───────────────────
supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    currentUser = session.user;
    currentProfile = await fetchMyProfile();
    console.log('[trio] Connecté :', currentUser.email);
  } else if (event === 'SIGNED_OUT') {
    currentUser = null;
    currentProfile = null;
  }
});

// ── Inscription — Étape 1 : envoyer email de confirmation ──────
async function authSignUp(email, password, userData) {
  try {
    showLoading('Création de votre compte…');

    // Créer le compte auth Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + '/app.html',
        data: {
          prenom: userData.prenom,
          age: userData.age,
          profile_type: userData.profileType,
        }
      }
    });

    if (error) throw error;

    hideLoading();

    // Supabase envoie automatiquement un vrai email de confirmation
    // On passe à l'étape du code
    regEmail = email;
    regUserData = { ...userData, userId: data.user?.id };

    setStepDone(1); setStepActive(2);
    document.getElementById('reg-step1').classList.remove('active');
    document.getElementById('reg-step2').classList.add('active');
    document.getElementById('email-sent-to').textContent = `Code envoyé à ${email}`;
    setTimeout(() => {
      const d = document.querySelectorAll('.code-digit');
      if (d[0]) d[0].focus();
    }, 100);
    startCodeTimer();

  } catch (err) {
    hideLoading();
    showToast('❌ ' + (err.message || 'Erreur lors de l\'inscription'));
    console.error('[trio] signUp error:', err);
  }
}

// ── Inscription — Étape 2 : vérifier le code OTP ──────────────
async function authVerifyOTP(email, code) {
  try {
    showLoading('Vérification du code…');

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });

    if (error) throw error;

    currentUser = data.user;
    hideLoading();

    // Passer à l'étape 3 (consentements)
    clearInterval(codeTimer);
    setStepDone(2); setStepActive(3);
    document.getElementById('reg-step2').classList.remove('active');
    document.getElementById('reg-step3').classList.add('active');

  } catch (err) {
    hideLoading();
    // Afficher l'erreur sur les champs code
    document.getElementById('e-code').classList.add('show');
    document.querySelectorAll('.code-digit').forEach(d => d.classList.add('error'));
    setTimeout(() => {
      document.getElementById('e-code').classList.remove('show');
      document.querySelectorAll('.code-digit').forEach(d => {
        d.classList.remove('error'); d.value = ''; d.classList.remove('filled');
      });
      document.querySelectorAll('.code-digit')[0].focus();
    }, 1500);
    console.error('[trio] OTP error:', err);
  }
}

// ── Inscription — Étape 3 : créer le profil en base ───────────
async function authCreateProfile() {
  if (!currentUser) {
    showToast('❌ Session expirée, recommencez');
    return;
  }
  try {
    showLoading('Création de votre profil…');

    const profileData = {
      id: currentUser.id,
      prenom: regUserData.prenom,
      age: parseInt(regUserData.age),
      ville: regUserData.ville || null,
      profile_type: regUserData.profileType || profileType || 'solo',
      trust_score: 70,
      categories: [],
      vibe_tags: [],
    };

    const { error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' });

    if (error) throw error;

    currentProfile = await fetchMyProfile();
    hideLoading();

    // Lancer l'app !
    launchApp();

  } catch (err) {
    hideLoading();
    showToast('❌ Erreur profil : ' + err.message);
    console.error('[trio] createProfile error:', err);
  }
}

// ── Connexion (utilisateur existant) ──────────────────────────
async function authSignIn(email, password) {
  try {
    showLoading('Connexion…');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentUser = data.user;
    currentProfile = await fetchMyProfile();
    hideLoading();
    launchApp();
  } catch (err) {
    hideLoading();
    showToast('❌ ' + err.message);
  }
}

// ── Déconnexion ───────────────────────────────────────────────
async function authSignOut() {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
}

// ── Renvoyer le code ──────────────────────────────────────────
async function authResendCode() {
  try {
    await supabase.auth.resend({ type: 'signup', email: regEmail });
    showToast('📧 Nouveau code envoyé à ' + regEmail);
    startCodeTimer();
  } catch (err) {
    showToast('❌ Erreur : ' + err.message);
  }
}

// ── Lancer l'app après connexion ──────────────────────────────
function launchApp() {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
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
  showToast('👋 Bienvenue ' + (currentProfile?.prenom || '') + ' !');
}

// ══════════════════════════════════════════════════════════════
//  PROFILS
// ══════════════════════════════════════════════════════════════

// ── Récupérer mon profil ───────────────────────────────────────
async function fetchMyProfile() {
  if (!currentUser) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();
  if (error) return null;
  return data;
}

// ── Charger les profils à afficher dans l'Explorer ────────────
async function fetchProfiles({ radius = 50, categories = null } = {}) {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', currentUser?.id || '')
      .limit(20);

    if (categories && categories.length > 0) {
      query = query.contains('categories', categories);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('[trio] fetchProfiles error:', err);
    return [];
  }
}

// ── Mettre à jour mon profil ───────────────────────────────────
async function updateMyProfile(updates) {
  if (!currentUser) return;
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', currentUser.id);
  if (error) showToast('❌ Erreur : ' + error.message);
  else currentProfile = { ...currentProfile, ...updates };
}

// ── Upload une photo de profil ─────────────────────────────────
async function uploadProfilePhoto(file, slot = 1) {
  if (!currentUser) return null;
  try {
    showLoading('Upload en cours…');
    const ext = file.name.split('.').pop();
    const path = `${currentUser.id}/photo${slot}.${ext}`;

    const { error: upError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true });

    if (upError) throw upError;

    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    const url = data.publicUrl;

    // Sauvegarder l'URL en base
    await updateMyProfile(slot === 1 ? { photo_url: url } : { photo2_url: url });
    hideLoading();
    showToast('📸 Photo mise à jour !');
    return url;
  } catch (err) {
    hideLoading();
    showToast('❌ Erreur upload : ' + err.message);
    return null;
  }
}

// ── Upload un VoiceBio ─────────────────────────────────────────
async function uploadVoiceBio(blob) {
  if (!currentUser) return null;
  try {
    const path = `${currentUser.id}/voice.webm`;
    const { error } = await supabase.storage
      .from('voice-bios')
      .upload(path, blob, { contentType: 'audio/webm', upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('voice-bios').getPublicUrl(path);
    await updateMyProfile({ voice_bio_url: data.publicUrl });
    showToast('🎤 VoiceBio enregistré !');
    return data.publicUrl;
  } catch (err) {
    showToast('❌ Erreur VoiceBio : ' + err.message);
    return null;
  }
}

// ══════════════════════════════════════════════════════════════
//  LIKES & MATCHS
// ══════════════════════════════════════════════════════════════

// ── Liker un profil ───────────────────────────────────────────
async function likeProfile(toUserId, isSuperMatch = false) {
  if (!currentUser) return;
  try {
    const { error } = await supabase.from('likes').insert({
      from_user: currentUser.id,
      to_user: toUserId,
      is_super_match: isSuperMatch,
    });
    if (error && error.code !== '23505') throw error; // ignore duplicate
    // La fonction SQL check_mutual_like() crée le match automatiquement
  } catch (err) {
    console.error('[trio] likeProfile error:', err);
  }
}

// ── Récupérer ses matchs ──────────────────────────────────────
async function fetchMyMatches() {
  if (!currentUser) return [];
  const { data, error } = await supabase
    .from('matches')
    .select(`
      *,
      profile1:user_1(id, prenom, age, ville, photo_url, online:last_active),
      profile2:user_2(id, prenom, age, ville, photo_url, online:last_active)
    `)
    .or(`user_1.eq.${currentUser.id},user_2.eq.${currentUser.id}`)
    .order('created_at', { ascending: false });
  if (error) return [];
  // Normaliser pour avoir toujours "l'autre utilisateur"
  return (data || []).map(m => ({
    matchId: m.id,
    createdAt: m.created_at,
    other: m.user_1 === currentUser.id ? m.profile2 : m.profile1,
  }));
}

// ══════════════════════════════════════════════════════════════
//  MESSAGERIE TEMPS RÉEL
// ══════════════════════════════════════════════════════════════

let messageSubscription = null;

// ── Charger les messages d'un match ───────────────────────────
async function fetchMessages(matchId) {
  const { data, error } = await supabase
    .from('messages')
    .select(`*, sender:sender_id(prenom, photo_url)`)
    .eq('match_id', matchId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return data || [];
}

// ── Envoyer un message ────────────────────────────────────────
async function sendMessage(matchId, content) {
  if (!currentUser || !content.trim()) return;
  const { error } = await supabase.from('messages').insert({
    match_id: matchId,
    sender_id: currentUser.id,
    content: content.trim(),
  });
  if (error) showToast('❌ Erreur envoi : ' + error.message);
}

// ── S'abonner aux messages en temps réel ──────────────────────
function subscribeToMessages(matchId, onNewMessage) {
  // Désabonner l'ancien canal si existant
  if (messageSubscription) {
    supabase.removeChannel(messageSubscription);
  }

  messageSubscription = supabase
    .channel(`messages:${matchId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `match_id=eq.${matchId}`,
    }, payload => {
      onNewMessage(payload.new);
    })
    .subscribe();

  return messageSubscription;
}

// ── Marquer les messages comme lus ────────────────────────────
async function markMessagesRead(matchId) {
  if (!currentUser) return;
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('match_id', matchId)
    .neq('sender_id', currentUser.id);
}

// ══════════════════════════════════════════════════════════════
//  VISITEURS DE PROFIL
// ══════════════════════════════════════════════════════════════

// ── Enregistrer une visite ────────────────────────────────────
async function recordProfileView(viewedUserId) {
  if (!currentUser || viewedUserId === currentUser.id) return;
  await supabase.from('profile_views').insert({
    viewer_id: currentUser.id,
    viewed_id: viewedUserId,
  }).onConflict('ignore');
}

// ── Récupérer mes visiteurs ───────────────────────────────────
async function fetchMyVisitors() {
  if (!currentUser) return [];
  const { data } = await supabase
    .from('profile_views')
    .select(`
      viewed_at,
      viewer:viewer_id(id, prenom, age, photo_url, last_active)
    `)
    .eq('viewed_id', currentUser.id)
    .order('viewed_at', { ascending: false })
    .limit(20);
  return data || [];
}

// ══════════════════════════════════════════════════════════════
//  RÉCOMPENSES QUOTIDIENNES
// ══════════════════════════════════════════════════════════════

// ── Vérifier si la récompense a déjà été réclamée aujourd'hui ─
async function hasDailyRewardBeenClaimed() {
  if (!currentUser) return true;
  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('daily_rewards')
    .select('id')
    .eq('user_id', currentUser.id)
    .gte('claimed_at', today + 'T00:00:00')
    .limit(1);
  return (data || []).length > 0;
}

// ── Réclamer la récompense ────────────────────────────────────
async function claimDailyRewardDB(dayNumber, prize) {
  if (!currentUser) return;
  await supabase.from('daily_rewards').insert({
    user_id: currentUser.id,
    day_number: dayNumber,
    prize,
  });
  // Mettre à jour le streak
  await updateMyProfile({
    streak_days: (currentProfile?.streak_days || 0) + 1,
    last_active: new Date().toISOString(),
  });
}

// ══════════════════════════════════════════════════════════════
//  NOTIFICATIONS TEMPS RÉEL
// ══════════════════════════════════════════════════════════════

let notifSubscription = null;

function subscribeToNotifications(onNotif) {
  if (!currentUser) return;
  if (notifSubscription) supabase.removeChannel(notifSubscription);

  // Écouter les nouveaux likes
  notifSubscription = supabase
    .channel(`notifs:${currentUser.id}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'likes',
      filter: `to_user=eq.${currentUser.id}`,
    }, async payload => {
      // Récupérer le profil de la personne qui a liké
      const { data } = await supabase
        .from('profiles')
        .select('prenom, photo_url')
        .eq('id', payload.new.from_user)
        .single();
      if (data) onNotif({ type: 'like', from: data });
    })
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'matches',
      filter: `user_1=eq.${currentUser.id}`,
    }, payload => {
      onNotif({ type: 'match', matchId: payload.new.id });
    })
    .subscribe();
}

// ══════════════════════════════════════════════════════════════
//  UTILITAIRES UI
// ══════════════════════════════════════════════════════════════

function showLoading(msg = 'Chargement…') {
  let el = document.getElementById('loading-overlay');
  if (!el) {
    el = document.createElement('div');
    el.id = 'loading-overlay';
    el.style.cssText = 'position:fixed;inset:0;z-index:999;background:rgba(14,12,13,.85);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;backdrop-filter:blur(6px);';
    el.innerHTML = `
      <div style="width:44px;height:44px;border-radius:50%;border:3px solid rgba(212,81,119,.2);border-top-color:var(--rose);animation:spin .8s linear infinite;"></div>
      <div id="loading-msg" style="font-size:14px;color:var(--text2);">${msg}</div>`;
    document.body.appendChild(el);
  } else {
    document.getElementById('loading-msg').textContent = msg;
    el.style.display = 'flex';
  }
}

function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.style.display = 'none';
}

// ── Exporter pour usage global ─────────────────────────────────
window.supabase = supabase;
window.currentUser = currentUser;
window.currentProfile = currentProfile;
window.authSignUp = authSignUp;
window.authVerifyOTP = authVerifyOTP;
window.authCreateProfile = authCreateProfile;
window.authSignIn = authSignIn;
window.authSignOut = authSignOut;
window.authResendCode = authResendCode;
window.uploadProfilePhoto = uploadProfilePhoto;
window.uploadVoiceBio = uploadVoiceBio;
window.likeProfile = likeProfile;
window.fetchMyMatches = fetchMyMatches;
window.fetchMessages = fetchMessages;
window.sendMessage = sendMessage;
window.subscribeToMessages = subscribeToMessages;
window.markMessagesRead = markMessagesRead;
window.recordProfileView = recordProfileView;
window.fetchMyVisitors = fetchMyVisitors;
window.hasDailyRewardBeenClaimed = hasDailyRewardBeenClaimed;
window.claimDailyRewardDB = claimDailyRewardDB;
window.subscribeToNotifications = subscribeToNotifications;
window.launchApp = launchApp;
