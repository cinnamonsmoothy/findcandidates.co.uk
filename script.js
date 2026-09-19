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
