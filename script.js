document.getElementById('year').textContent = new Date().getFullYear();

// Clean directory routes work on GitHub Pages. When files are opened directly,
// point those same links at their index files so local navigation still works.
if (window.location.protocol === 'file:') {
  document.querySelectorAll('a[href="websites/"]').forEach((link) => link.setAttribute('href', 'websites/index.html'));
  document.querySelectorAll('a[href="../"]').forEach((link) => link.setAttribute('href', '../index.html'));
  document.querySelectorAll('a[href="./"]').forEach((link) => link.setAttribute('href', 'index.html'));
}

let lastScrollY = window.scrollY;
let scrollDirection = 'down';

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  scrollDirection = currentScrollY < lastScrollY ? 'up' : 'down';
  lastScrollY = currentScrollY;
}, { passive: true });

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.setProperty('--reveal-y', scrollDirection === 'up' ? '-18px' : '18px');
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

document.querySelectorAll('details').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('details[open]').forEach((other) => {
      if (other !== item) other.removeAttribute('open');
    });
  });
});

const briefDialog = document.getElementById('brief-dialog');
const briefForm = document.getElementById('brief-form');
const briefClose = briefDialog?.querySelector('.brief-close');
const briefSubmit = briefForm?.querySelector('.brief-submit');
const chatBriefTrigger = document.querySelector('[data-chat-brief]');
const mobileBriefQuery = window.matchMedia('(max-width: 600px)');

// Keep the brief available for later, but send every CTA straight to WhatsApp while disabled.
const BRIEF_ENABLED = false;
const directWhatsAppUrl = `https://api.whatsapp.com/send?phone=447345208104&text=${encodeURIComponent("Hi, I'd like to get my first 5 CVs free.")}`;

const updateBriefSubmitLabel = () => {
  const hasDetails = [...new FormData(briefForm).values()].some((value) => String(value).trim());
  briefSubmit.textContent = hasDetails ? 'Continue on WhatsApp' : 'Skip';
};

briefForm?.addEventListener('input', updateBriefSubmitLabel);
briefForm?.addEventListener('change', updateBriefSubmitLabel);

document.querySelectorAll('[data-brief-cta]').forEach((cta) => {
  if (!BRIEF_ENABLED) {
    cta.setAttribute('href', directWhatsAppUrl);
    cta.setAttribute('target', '_blank');
    cta.setAttribute('rel', 'noopener');
    return;
  }

  cta.addEventListener('click', (event) => {
    if (!briefDialog) return;
    event.preventDefault();
    if (typeof briefDialog.showModal === 'function') {
      briefDialog.showModal();
    } else {
      briefDialog.setAttribute('open', '');
    }
    document.body.classList.add('brief-open');
  });
});

const openChatBrief = () => {
  if (!briefDialog) return;

  if (briefDialog.open) {
    closeBrief();
    return;
  }

  const isMobile = mobileBriefQuery.matches;
  briefDialog.classList.toggle('chat-mobile-mode', isMobile);
  briefDialog.classList.toggle('chat-widget-mode', !isMobile);
  chatBriefTrigger?.setAttribute('aria-expanded', 'true');
  document.body.classList.add('chat-brief-open');

  if (isMobile && typeof briefDialog.showModal === 'function') {
    briefDialog.showModal();
    document.body.classList.add('brief-open');
  } else if (typeof briefDialog.show === 'function') {
    briefDialog.show();
  } else {
    briefDialog.setAttribute('open', '');
  }
};

chatBriefTrigger?.addEventListener('click', (event) => {
  event.preventDefault();
  openChatBrief();
});

const closeBrief = () => {
  if (typeof briefDialog.close === 'function') {
    briefDialog.close();
  } else {
    briefDialog.removeAttribute('open');
  }
  if (window.location.hash === '#brief-dialog') {
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  }
  document.body.classList.remove('brief-open');
  document.body.classList.remove('chat-brief-open');
  briefDialog?.classList.remove('chat-mobile-mode', 'chat-widget-mode');
  chatBriefTrigger?.setAttribute('aria-expanded', 'false');
};

briefClose?.addEventListener('click', (event) => {
  event.preventDefault();
  closeBrief();
});
briefDialog?.addEventListener('click', (event) => {
  if (event.target === briefDialog) closeBrief();
});
briefDialog?.addEventListener('close', () => {
  document.body.classList.remove('brief-open', 'chat-brief-open');
  briefDialog.classList.remove('chat-mobile-mode', 'chat-widget-mode');
  chatBriefTrigger?.setAttribute('aria-expanded', 'false');
});

document.addEventListener('click', (event) => {
  if (!briefDialog?.open || mobileBriefQuery.matches) return;
  if (briefDialog.contains(event.target) || chatBriefTrigger?.contains(event.target)) return;
  closeBrief();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && briefDialog?.open && !mobileBriefQuery.matches) closeBrief();
});

briefForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(briefForm);
  const hasDetails = [...data.values()].some((value) => String(value).trim());
  const lines = ["Hi, I'd like to get my first 5 CVs free."];

  if (hasDetails) {
    lines.push(
      '',
      `Role: ${data.get('role') || 'Not specified'}`,
      `Location: ${data.get('location') || 'Not specified'}`,
      `Salary/rate: ${data.get('salary') || 'Not specified'}`,
      `Type: ${data.get('type') || 'Not specified'}`
    );
  }
  const whatsappUrl = `https://api.whatsapp.com/send?phone=447345208104&text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(whatsappUrl, '_blank', 'noopener');
  closeBrief();
});
