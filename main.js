const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  const button = item.querySelector('button');
  button.addEventListener('click', () => {
    faqItems.forEach((other) => {
      if (other !== item) other.classList.remove('active');
    });
    item.classList.toggle('active');
  });
});

const form = document.querySelector('.quote-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach((field) => {
      const isEmpty = !String(field.value || '').trim();
      field.classList.toggle('is-invalid', isEmpty);
      if (isEmpty) valid = false;
    });

    if (!valid) {
      form.querySelector('.is-invalid')?.focus();
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const oldText = submitButton.textContent;
    submitButton.textContent = 'Request Received';
    submitButton.disabled = true;

    window.setTimeout(() => {
      submitButton.textContent = oldText;
      submitButton.disabled = false;
      form.reset();
    }, 1800);
  });

  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
  });
}

const galleryTrack = document.querySelector('.gallery-track');
if (galleryTrack) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;
  const viewport = document.querySelector('.gallery-viewport');

  viewport.addEventListener('mousedown', (event) => {
    isDown = true;
    startX = event.pageX - viewport.offsetLeft;
    scrollLeft = viewport.scrollLeft;
    viewport.style.cursor = 'grabbing';
  });

  viewport.addEventListener('mouseleave', () => {
    isDown = false;
    viewport.style.cursor = '';
  });

  viewport.addEventListener('mouseup', () => {
    isDown = false;
    viewport.style.cursor = '';
  });

  viewport.addEventListener('mousemove', (event) => {
    if (!isDown) return;
    event.preventDefault();
    const x = event.pageX - viewport.offsetLeft;
    const walk = (x - startX) * 1.2;
    viewport.scrollLeft = scrollLeft - walk;
  });
}
