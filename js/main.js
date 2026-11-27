(function () {
  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      mobileBtn.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Login popover toggle
  const loginBtn = document.getElementById('loginBtn');
  const loginPopover = document.getElementById('loginPopover');
  if (loginBtn && loginPopover) {
    loginBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = loginPopover.classList.toggle('open');
      loginBtn.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (e) => {
      if (loginPopover.classList.contains('open') && !e.target.closest('.nav-right')) {
        loginPopover.classList.remove('open');
        loginBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Interactive "How it works" programme selector
  const programmes = {
    coaching: {
      img: 'assets/food-balanced-lunch.jpg',
      alt: 'Balanced whole-food lunch plate',
      tag: 'Personal support',
      badge: '',
      title: '1-on-1 Coaching Programme',
      sub: 'Personal support, tailored to you.',
      desc: 'Work towards your health goals with individual guidance shaped around your needs, routines and real life. Build understanding, confidence and habits you can maintain.',
      bullets: [
        'Personal goals and guidance',
        'Support and accountability',
        'Practical, sustainable habits'
      ],
      cta: 'Ask about 1-on-1 coaching →',
      value: '1-on-1 Coaching Programme'
    },
    workplace: {
      img: 'assets/workplace-wellness.jpg',
      alt: 'Workplace team enjoying a NutriFYI wellbeing session',
      tag: 'For organisations',
      badge: '',
      title: 'Employee Wellness Programme',
      sub: 'Healthier habits at work and beyond.',
      desc: 'Give your people practical, science-informed nutrition and wellbeing support that fits around working life and helps make healthier choices feel more achievable.',
      bullets: [
        'Employee wellbeing and awareness',
        'Healthier everyday routines',
        'Practical behaviour change'
      ],
      cta: 'Explore workplace support →',
      value: 'Employee Wellness Programme'
    },
    membership: {
      img: 'assets/food-meal-prep.jpg',
      alt: 'Fresh weekly whole-food meal prep containers',
      tag: 'Self-guided',
      badge: '<span class="pill-tag pill-honey" style="margin-bottom:12px; margin-left:6px;">Coming soon</span>',
      title: 'NutriFYI Membership',
      sub: 'Learn at your own pace. Build a lifestyle that works for you.',
      desc: 'For people who want to feel better in everyday life, not just eat better. Explore nutrition, movement, stress, energy and mindset in your own time, with practical guidance you can return to whenever you need it.',
      bullets: [
        'Learn at your own pace',
        'Nutrition, movement and mindset',
        'Small steps that fit your life'
      ],
      cta: 'Ask about membership →',
      value: 'NutriFYI Membership'
    }
  };

  const fitResult = document.getElementById('fitResult');
  const programmeSelect = document.getElementById('programme');

  window.preselectProgramme = function (val) {
    if (programmeSelect) programmeSelect.value = val;
  };

  document.querySelectorAll('.finder-opt').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const d = programmes[key];
      if (!d || !fitResult) return;

      document.querySelectorAll('.finder-opt').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      fitResult.innerHTML = `
        <img class="finder-photo" src="${d.img}" alt="${d.alt}" />
        <div class="finder-result-body">
          <span class="pill-tag" style="margin-bottom: 12px;">${d.tag}</span>${d.badge}
          <h3>${d.title}</h3>
          <div class="sub">${d.sub}</div>
          <p style="color: var(--muted); font-size: 14.5px;">${d.desc}</p>
          <ul>${d.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>
          <a href="#contact" class="btn btn-primary" onclick="preselectProgramme('${d.value}')">${d.cta}</a>
        </div>
      `;
    });
  });

  // Netlify Forms AJAX submission (with graceful mailto fallback when tested locally)
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  if (form && statusEl) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      const body = new URLSearchParams(new FormData(form)).toString();
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

      if (isLocal) {
        form.style.display = 'none';
        statusEl.className = 'form-status success';
        statusEl.innerHTML = '<strong>Thank you.</strong> We’ll reply within one working day. <br><small>(Local preview mode — live Netlify Forms submission activates automatically once deployed to Netlify.)</small>';
        return;
      }

      try {
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body
        });
        if (res.ok) {
          form.style.display = 'none';
          statusEl.className = 'form-status success';
          statusEl.innerHTML = '<strong>Thank you.</strong> We’ll reply within one working day.';
        } else {
          throw new Error('Submission failed');
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Get in touch';
        }
        statusEl.className = 'form-status error';
        statusEl.innerHTML = 'Something went wrong sending your message. Please email <a href="mailto:webs4biz.lab@gmail.com" style="color:inherit;font-weight:700;">webs4biz.lab@gmail.com</a> directly.';
      }
    });
  }
})();
