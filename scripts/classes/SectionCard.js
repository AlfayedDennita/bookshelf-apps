class SectionCard {
  constructor({ sectionCardTogglers }) {
    this._sectionCardTogglers = sectionCardTogglers;

    this.init();
  }

  init() {
    this.togglersListener();
  }

  togglersListener() {
    for (const toggler of this._sectionCardTogglers) {
      toggler.addEventListener('click', () => {
        const sectionCard = toggler.closest('.section-card');
        const isSectionCardOpen = sectionCard.getAttribute('data-open') === "true";
        const togglerIcon = toggler.querySelector('i');

        sectionCard.setAttribute('data-open', isSectionCardOpen ? false : true);

        toggler.title = isSectionCardOpen ? 'Buka' : 'Sembunyikan';
        togglerIcon.classList = isSectionCardOpen ? 'fas fa-eye-slash fa-fw' : 'fas fa-eye fa-fw';
      });
    }
  }
}

export default SectionCard;
