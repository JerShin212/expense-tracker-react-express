// theme.ts
export function initTheme() {
  const ls = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const shouldDark = ls ? ls === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', shouldDark)
}

export function setTheme(mode) {
  if (mode === 'system') {
    localStorage.removeItem('theme')
  } else {
    localStorage.setItem('theme', mode)
  }
  initTheme()
}
