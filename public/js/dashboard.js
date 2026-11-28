(function () {
  // Format live date in South African English style
  const dateEl = document.getElementById('liveDate');
  if (dateEl) {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    dateEl.textContent = formatted;
  }

  // Mobile sidebar drawer
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const openBtn = document.getElementById('mobileSidebarBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  function setSidebarOpen(open) {
    if (!sidebar || !backdrop) return;
    sidebar.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
  }

  if (openBtn) openBtn.addEventListener('click', () => setSidebarOpen(true));
  if (closeBtn) closeBtn.addEventListener('click', () => setSidebarOpen(false));
  if (backdrop) backdrop.addEventListener('click', () => setSidebarOpen(false));

  // Toast helper
  const toast = document.getElementById('toastBanner');
  const toastText = document.getElementById('toastText');
  const toastClose = document.getElementById('toastClose');

  function showToast(msg) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove('hidden');
  }

  if (toastClose && toast) {
    toastClose.addEventListener('click', () => toast.classList.add('hidden'));
  }

  // Sidebar nav state
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      navButtons.forEach((b) => {
        b.classList.remove('active');
        b.removeAttribute('aria-current');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-current', 'page');
      setSidebarOpen(false);
      const section = btn.dataset.section;
      if (section && section !== 'Dashboard') {
        showToast('Viewing ' + section + ' highlights in your NutriFYI dashboard preview.');
      }
    });
  });

  // Live search filter across Habit Focus Areas and Recent Activity
  const searchInput = document.getElementById('dashboardSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.habit-row, .activity-item').forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.classList.toggle('hidden', q.length > 0 && !text.includes(q));
      });
    });
  }

  // Check-In Modal
  const modal = document.getElementById('checkInModal');
  const openModalTriggers = document.querySelectorAll('[data-open-checkin]');
  const closeModalTriggers = document.querySelectorAll('[data-close-checkin]');
  const checkInForm = document.getElementById('checkInForm');
  const energyButtons = document.querySelectorAll('.energy-pill');
  let selectedEnergy = 'Steady';

  function setModalOpen(open) {
    if (!modal) return;
    modal.classList.toggle('hidden', !open);
  }

  openModalTriggers.forEach((el) => {
    el.addEventListener('click', () => setModalOpen(true));
  });

  closeModalTriggers.forEach((el) => {
    el.addEventListener('click', () => setModalOpen(false));
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) setModalOpen(false);
    });
  }

  energyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      energyButtons.forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedEnergy = btn.dataset.energy || 'Steady';
    });
  });

  // Persist & apply logged check-ins
  const kpiHabitsEl = document.getElementById('kpiHabits');
  const activityListEl = document.getElementById('activityList');
  let weeklyHabitsCount = 18;

  if (checkInForm) {
    checkInForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const checked = Array.from(checkInForm.querySelectorAll('input[name="habit"]:checked')).map((i) => i.value);
      const noteEl = document.getElementById('checkInNote');
      const note = noteEl ? noteEl.value.trim() : '';

      weeklyHabitsCount += Math.max(checked.length, 1);
      if (kpiHabitsEl) kpiHabitsEl.textContent = String(weeklyHabitsCount);

      if (activityListEl) {
        const item = document.createElement('div');
        item.className = 'activity-item';

        const badge = document.createElement('div');
        badge.className = 'activity-badge habit-icon-leaf';
        badge.textContent = '✓';

        const textWrap = document.createElement('div');
        textWrap.className = 'activity-text';

        const title = document.createElement('strong');
        title.textContent = 'Check-in logged (' + selectedEnergy + ')';

        const detail = document.createElement('span');
        detail.textContent = note || (checked.length > 0 ? checked.join(', ') : 'Daily wellbeing check-in saved');

        const time = document.createElement('span');
        time.className = 'activity-time';
        time.textContent = 'Just now';

        textWrap.append(title, detail, time);
        item.append(badge, textWrap);
        activityListEl.prepend(item);
      }

      if (noteEl) noteEl.value = '';
      setModalOpen(false);
      showToast('Check-in saved — Progress, not perfection.');
    });
  }

  // Quick interactive feedback for secondary buttons
  document.querySelectorAll('[data-toast]').forEach((btn) => {
    btn.addEventListener('click', () => {
      showToast(btn.dataset.toast);
    });
  });
})();
