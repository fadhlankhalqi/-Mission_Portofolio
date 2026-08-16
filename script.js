const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu-button]');
const nav = document.querySelector('[data-nav]');
const profilePhoto = document.querySelector('[data-profile-photo]');
const profileFallback = document.querySelector('[data-profile-fallback]');

document.querySelector('[data-year]').textContent = new Date().getFullYear();

const showProfileFallback = () => profilePhoto.classList.add('is-missing');
if (profilePhoto.complete) {
  if (profilePhoto.naturalWidth === 0) showProfileFallback();
} else {
  profilePhoto.addEventListener('error', showProfileFallback, { once: true });
  profilePhoto.addEventListener('load', () => profileFallback.classList.add('is-hidden'), { once: true });
}

const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  nav.classList.toggle('is-open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.style.overflow = '';
  });
});
