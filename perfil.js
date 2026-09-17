(() => {
  const KEYS = {
    profile: 'smartpath-profile',
    sessions: 'smartpath-study-sessions',
    performance: 'smartpath-performance',
    activeSession: 'smartpath-active-session'
  };
  const subjects = ['Matemática', 'Linguagens', 'Ciências da Natureza', 'Ciências Humanas', 'Redação'];
  const $ = (selector) => document.querySelector(selector);

  function safeParse(value, fallback) {
    try { return JSON.parse(value) ?? fallback; } catch { return fallback; }
  }
  function getProfile() {
    const saved = safeParse(localStorage.getItem(KEYS.profile), {});
    return { name: localStorage.getItem('nomeUsuario') || saved.name || 'Estudante', email: saved.email || '', goal: Number(saved.goal) || 8, reminder: Boolean(saved.reminder) };
  }
  function getSessions() { return safeParse(localStorage.getItem(KEYS.sessions), []); }
  function getPerformance() { return safeParse(localStorage.getItem(KEYS.performance), []); }
  function formatTime(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    return `${hours}h ${String(minutes).padStart(2, '0')}min`;
  }
  function formatClock(seconds) {
    const value = Math.max(0, Math.floor(seconds));
    return [Math.floor(value / 3600), Math.floor(value / 60) % 60, value % 60].map(part => String(part).padStart(2, '0')).join(':');
  }
  function startOfWeek() {
    const date = new Date();
    const offset = (date.getDay() + 6) % 7;
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    return date.getTime();
  }
  function performanceBySubject() {
    const totals = new Map();
    getPerformance().forEach(entry => {
      const current = totals.get(entry.subject) || { correct: 0, total: 0 };
      current.correct += Number(entry.correct) || 0;
      current.total += Number(entry.total) || 0;
      totals.set(entry.subject, current);
    });
    return subjects.map(subject => {
      const item = totals.get(subject);
      return { subject, percent: item?.total ? Math.round((item.correct / item.total) * 100) : null };
    }).filter(item => item.percent !== null).sort((a, b) => b.percent - a.percent);
  }
  function renderProfile() {
    const profile = getProfile();
    const initials = profile.name.trim().split(/\s+/).slice(0, 2).map(name => name[0]).join('').toUpperCase() || 'SP';
    $('#profileInitials').textContent = initials;
    $('#profile-name').textContent = profile.name;
    $('#profileGoalText').textContent = `Sua meta é estudar ${profile.goal} horas por semana. Cada sessão conta para sua evolução.`;
    $('#weeklyGoal').textContent = profile.goal;
  }
  function renderDashboard() {
    const sessions = getSessions();
    const currentStart = Date.now();
    const active = safeParse(localStorage.getItem(KEYS.activeSession), null);
    const activeSeconds = active?.startedAt ? Math.max(0, Math.floor((currentStart - active.startedAt) / 1000)) : 0;
    const total = sessions.reduce((sum, session) => sum + (Number(session.seconds) || 0), 0) + activeSeconds;
    const weekStart = startOfWeek();
    const week = sessions.filter(session => Number(session.endedAt) >= weekStart).reduce((sum, session) => sum + (Number(session.seconds) || 0), 0) + activeSeconds;
    const profile = getProfile();
    const goalSeconds = profile.goal * 3600;
    const progress = Math.min(100, Math.round((week / goalSeconds) * 100));
    const left = Math.max(0, goalSeconds - week);
    $('#totalStudyTime').textContent = formatTime(total);
    $('#weeklyStudyTime').textContent = formatTime(week);
    $('#weeklyMessage').textContent = week ? 'tempo registrado nesta semana' : 'Comece uma sessão hoje';
    $('#goalPercent').textContent = `${progress}%`;
    $('#goalProgress').style.width = `${progress}%`;
    $('.goal-progress').setAttribute('aria-valuenow', progress);
    $('#goalDetail').textContent = left ? `Faltam ${formatTime(left)} para alcançar sua meta.` : 'Meta alcançada! Que tal manter o ritmo?';

    const results = performanceBySubject();
    const best = results[0];
    $('#bestSubjectScore').textContent = best ? `${best.percent}%` : '—';
    $('#bestSubjectName').textContent = best ? best.subject : 'Registre seus acertos';
    const list = $('#subjectList');
    list.innerHTML = results.map(item => `<div class="subject-row"><span class="subject-name">${item.subject}</span><div class="subject-bar" aria-label="${item.subject}: ${item.percent}%"><span style="width:${item.percent}%"></span></div><span class="subject-score">${item.percent}%</span></div>`).join('');
    $('#performanceEmpty').hidden = results.length > 0;
  }
  let timerId = null;
  function activeSession() { return safeParse(localStorage.getItem(KEYS.activeSession), null); }
  function updateTimer() {
    const active = activeSession();
    const seconds = active?.startedAt ? (Date.now() - active.startedAt) / 1000 : 0;
    $('#timerDisplay').textContent = formatClock(seconds);
    $('#timerButton').textContent = active ? 'Pausar e salvar' : 'Iniciar sessão';
    $('#timerStatus').textContent = active ? `Estudando ${active.subject}` : 'Pronto para começar';
    $('#timerStatus').classList.toggle('is-running', Boolean(active));
    $('#studySubject').value = active?.subject || $('#studySubject').value;
    $('#studySubject').disabled = Boolean(active);
    renderDashboard();
  }
  function toggleTimer() {
    const active = activeSession();
    if (active) {
      saveActiveSession();
      clearInterval(timerId); timerId = null;
    } else {
      localStorage.setItem(KEYS.activeSession, JSON.stringify({ subject: $('#studySubject').value, startedAt: Date.now() }));
      timerId = window.setInterval(updateTimer, 1000);
    }
    updateTimer();
  }
  function saveActiveSession() {
    const active = activeSession();
    if (!active?.startedAt) return;
    const seconds = Math.max(1, Math.floor((Date.now() - active.startedAt) / 1000));
    const sessions = getSessions();
    sessions.push({ subject: active.subject, seconds, endedAt: Date.now() });
    localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
    localStorage.removeItem(KEYS.activeSession);
  }
  function openProfileDialog() {
    const profile = getProfile();
    $('#userName').value = profile.name;
    $('#userEmail').value = profile.email;
    $('#goalHours').value = profile.goal;
    $('#studyReminder').checked = profile.reminder;
    $('#profileDialog').showModal();
  }
  function saveProfile(event) {
    event.preventDefault();
    const name = $('#userName').value.trim();
    if (!name) return;
    const profile = { name, email: $('#userEmail').value.trim(), goal: Math.max(1, Number($('#goalHours').value) || 8), reminder: $('#studyReminder').checked };
    localStorage.setItem(KEYS.profile, JSON.stringify(profile));
    localStorage.setItem('nomeUsuario', name);
    $('#profileDialog').close();
    renderProfile(); renderDashboard();
  }
  function savePerformance(event) {
    event.preventDefault();
    const correct = Number($('#correctAnswers').value);
    const total = Number($('#totalAnswers').value);
    if (!Number.isFinite(correct) || !Number.isFinite(total) || correct < 0 || total < 1 || correct > total) {
      alert('Informe um número de acertos entre 0 e o total de questões.'); return;
    }
    const performance = getPerformance();
    performance.push({ subject: $('#performanceSubject').value, correct, total, createdAt: Date.now() });
    localStorage.setItem(KEYS.performance, JSON.stringify(performance));
    $('#performanceForm').reset();
    $('#performanceDialog').close();
    renderDashboard();
  }
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-route]').forEach(button => button.addEventListener('click', () => { window.location.href = button.dataset.route; }));
    document.querySelectorAll('[data-open-profile]').forEach(button => button.addEventListener('click', openProfileDialog));
    document.querySelectorAll('[data-open-performance]').forEach(button => button.addEventListener('click', () => $('#performanceDialog').showModal()));
    document.querySelectorAll('[data-close-dialog]').forEach(button => button.addEventListener('click', () => $(`#${button.dataset.closeDialog}`).close()));
    $('#timerButton').addEventListener('click', toggleTimer);
    $('#profileForm').addEventListener('submit', saveProfile);
    $('#performanceForm').addEventListener('submit', savePerformance);
    window.addEventListener('pagehide', saveActiveSession);
    renderProfile(); renderDashboard(); updateTimer();
    if (activeSession()) timerId = window.setInterval(updateTimer, 1000);
  });
})();
