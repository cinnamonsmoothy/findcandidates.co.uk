document.getElementById('year').textContent = new Date().getFullYear();

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

document.querySelectorAll('[data-brief-cta]').forEach((cta) => {
  cta.addEventListener('click', (event) => {
    if (!briefDialog?.showModal) return;
    event.preventDefault();
    briefDialog.showModal();
    document.body.classList.add('brief-open');
    requestAnimationFrame(() => briefForm.elements.role.focus());
  });
});

const closeBrief = () => {
  briefDialog.close();
  document.body.classList.remove('brief-open');
};

briefClose?.addEventListener('click', closeBrief);
briefDialog?.addEventListener('click', (event) => {
  if (event.target === briefDialog) closeBrief();
});
briefDialog?.addEventListener('close', () => document.body.classList.remove('brief-open'));

briefForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(briefForm);
  const lines = [
    "Hi, I'd like to get my first 10 CVs free.",
    '',
    `Role: ${data.get('role')}`,
    `Location: ${data.get('location')}`,
    `Salary/rate: ${data.get('salary') || 'Not specified'}`,
    `Type: ${data.get('type')}`,
    `Must-haves: ${data.get('mustHaves')}`
  ];
  const whatsappUrl = `https://api.whatsapp.com/send?phone=447345208104&text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(whatsappUrl, '_blank', 'noopener');
  closeBrief();
});
