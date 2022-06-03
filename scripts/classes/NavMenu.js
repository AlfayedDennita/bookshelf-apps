class NavMenu {
  constructor({ openMenuButton, closeMenuButton, navMenuContainer }) {
    this._openMenuButton = openMenuButton;
    this._closeMenuButton = closeMenuButton;
    this._navMenuContainer = navMenuContainer;

    this.init();
  }

  init() {
    const toggleNavMenu = () => {
      const isOnMobile = window.matchMedia('(max-width: 767px)').matches;

      if (isOnMobile) {
        const isNavMenuOpen = this._navMenuContainer.getAttribute('data-open') === 'true';

        this._navMenuContainer.setAttribute('data-open', isNavMenuOpen ? false : true);
        document.body.setAttribute('data-scroll', isNavMenuOpen ? true : 'only-desktop');
      }
    } 

    this._openMenuButton.addEventListener('click', toggleNavMenu);
    this._closeMenuButton.addEventListener('click', toggleNavMenu);
    this._navMenuContainer.addEventListener('click', (e) => e.target === this._navMenuContainer && toggleNavMenu());

    const navMenuButtons = this._navMenuContainer.querySelectorAll('button');

    for (const button of navMenuButtons) {
      button.addEventListener('click', toggleNavMenu);
    }
  }
}

export default NavMenu;
