import { CUSTOM_EVENTS } from '../constants.js';

class ModalContainer {
  constructor({ containers }) {
    this._containers = containers;

    this.init();
  }

  init() {
    for (const container of this._containers) {
      container.addEventListener('click', (e) => {
        if (e.target === container) {
          container.removeAttribute('data-open');
          document.body.setAttribute('data-scroll', true);
          container.dispatchEvent(new Event(CUSTOM_EVENTS.MODAL_CLOSED));
        }
      });
    }
  }
}

export default ModalContainer;
