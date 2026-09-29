translatePage();

const btn = document.getElementById('languageSelection');
const menu = document.getElementById('langMenu');

btn.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !open);
  menu.hidden = open;
});

menu.addEventListener('click', e => {
  const li = e.target.closest('li[role="option"]');
  if (!li) return;
  document.getElementById('currentFlag').src = li.dataset.flag;
  document.getElementById('currentLabel').textContent = li.dataset.lang;
  menu.hidden = true;
  btn.setAttribute('aria-expanded', 'false');
  // hook this into your i18n switch:
  setLanguage(li.dataset.lang);
});

// close when clicking outside
document.addEventListener('click', e => {
  if (!e.target.closest('.lang-dd')) {
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }
});