const themes = [
  ['#000000', '#1A1A1A', '#C0C0C0'],
  ['#0F0F0F', '#2B2B2B', '#8E8E8E'],
  ['#050505', '#222222', '#D1B75F'],
  ['#0A0A0A', '#1F1F1F', '#9D9D9D'],
  ['#111111', '#292929', '#E0C99D'],
  ['#000000', '#191919', '#DADADA']
];

let current = parseInt(localStorage.getItem('bigTask_themeIndex')) || 0;

function applySmartTheme(combo) {
  const [base, surface, accent] = combo;

  // Add theme class
  document.body.classList.add('themed');

  // Store active theme colors as CSS variables
  document.body.style.setProperty('--base', base);
  document.body.style.setProperty('--surface', surface);
  document.body.style.setProperty('--accent', accent);

  localStorage.setItem('bigTask_themeIndex', current);
}

// Auto-apply last used theme
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('bigTask_themeIndex') !== null) {
    applySmartTheme(themes[current]);
  }
});

// Switch button
document.addEventListener('click', e => {
  if (e.target.id === 'themeButton') {
    current = (current + 1) % themes.length;
    applySmartTheme(themes[current]);
  }
});
