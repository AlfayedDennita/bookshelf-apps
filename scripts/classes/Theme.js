import { STORAGE_KEYS } from '../constants.js'
import { isStorageExists } from '../functions.js';

class Theme {
  constructor({ themeToggler }) {
    this._theme = document.body.getAttribute('data-theme') || 'day';
    this._storageKeys = STORAGE_KEYS.THEME;

    this._themeToggler = themeToggler;

    this.init();
  }

  init() {
    if (isStorageExists()) {
      if (this.isThemeOnStorage()) {
        this._theme = this.getThemeFromStorage();
      } else {
        const isUserPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this._theme = isUserPrefersDark ? 'night' : 'day';

        this.setThemeToStorage();
      }
    }

    document.body.setAttribute('data-theme', this._theme);

    this.themeTogglerListener();
  }

  setThemeToStorage(theme = this._theme) {
    localStorage.setItem(this._storageKeys, theme);
  }

  getThemeFromStorage() {
    return localStorage.getItem(this._storageKeys);
  }

  isThemeOnStorage() {
    return Boolean(this.getThemeFromStorage());
  }

  themeTogglerListener() {
    const themeTogglerIcon = this._themeToggler.querySelector('i');
    const themeTogglerText = this._themeToggler.querySelector('span');

    const changeToggler = (currentTheme) => {
      themeTogglerIcon.classList = currentTheme === 'day' ? 'fas fa-cloud-moon fa-fw' : 'fas fa-sun fa-fw';
      themeTogglerText.innerText = currentTheme === 'day' ? 'Beralih ke Mode Malam' : 'Beralih ke Mode Siang';
    }

    changeToggler(this._theme);

    this._themeToggler.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = currentTheme === 'day' ? 'night' : 'day';

      document.body.setAttribute('data-theme', newTheme);
      changeToggler(newTheme);

      if (isStorageExists()) {
        this.setThemeToStorage(newTheme);
      }
    });
  }
}

export default Theme;
