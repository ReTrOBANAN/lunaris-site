'use strict';

const header = document.querySelector('.top');
const toggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

if (header && toggle && navigation) {
  header.classList.add('has-menu');
  toggle.hidden = false;

  const setMenuOpen = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    navigation.classList.toggle('is-open', open);
  };

  toggle.addEventListener('click', () => {
    setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenuOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      toggle.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (!header.contains(event.target)) setMenuOpen(false);
  });

  window.matchMedia('(min-width: 701px)').addEventListener('change', () => setMenuOpen(false));
}

// Opening a direct link to a research section also reveals its details panel.
const revealHashTarget = () => {
  const id = window.location.hash.slice(1);
  const target = document.getElementById(id);
  const details = target?.closest('details');
  if (details && !details.open) {
    details.open = true;
    requestAnimationFrame(() => target.scrollIntoView());
  }
};
revealHashTarget();
window.addEventListener('hashchange', revealHashTarget);

const copyStatus = document.querySelector('#copy-status');
document.querySelectorAll('[data-copy]').forEach((button) => {
  button.hidden = false;
  let resetTimer;
  const original = button.textContent;

  button.addEventListener('click', async () => {
    clearTimeout(resetTimer);
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      button.textContent = 'Скопировано ✓';
      if (copyStatus) copyStatus.textContent = 'Контакт скопирован в буфер обмена';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(button.previousElementSibling);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      button.textContent = 'Текст выделен';
      if (copyStatus) copyStatus.textContent = 'Текст выделен. Скопируйте его через меню устройства или сочетанием клавиш.';
    }
    resetTimer = setTimeout(() => {
      button.textContent = original;
      if (copyStatus) copyStatus.textContent = '';
    }, 2500);
  });
});
