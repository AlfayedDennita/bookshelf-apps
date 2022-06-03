import { CUSTOM_EVENTS } from "../constants.js";

class Dialog {
  static modalContainer = document.querySelector('#custom-dialog-modal');
  static dialogContainer = this.modalContainer.querySelector('dialog');

  static modalContainerListener() {
    const clearDialogContainer = () => this.dialogContainer.innerHTML = '';

    this.modalContainer.removeEventListener(CUSTOM_EVENTS.MODAL_CLOSED, clearDialogContainer);
    this.modalContainer.addEventListener(CUSTOM_EVENTS.MODAL_CLOSED, clearDialogContainer);
  }

  static closeDialog() {
    this.modalContainer.removeAttribute('data-open');
    this.dialogContainer.innerHTML = '';
    document.body.setAttribute('data-scroll', true);
  }

  static alert(message = '') {
    this.dialogContainer.innerHTML = this.alertDialogTemplate(message);
    this.modalContainer.setAttribute('data-open', true);
    document.body.setAttribute('data-scroll', false);

    const closeButtons = this.dialogContainer.querySelectorAll('.close-dialog-button');

    for (const closeButton of closeButtons) {
      closeButton.addEventListener('click', () => this.closeDialog());
    }

    this.modalContainerListener();
  }

  static alertDialogTemplate(message) {
    return `
      <header>
        <h2>Perhatian</h2>
        <button class="close-dialog-button" type="button" title="Tutup"><i class="fas fa-xmark"></i></button>
      </header>
      <section class="section-card-content">
        <p>${message}</p>
      </section>
      <footer>
        <button class="close-dialog-button button" type="button" title="Mengerti">Mengerti</button>
      </footer>
    `;
  }

  static confirm(message = '') {
    this.dialogContainer.innerHTML = this.confirmDialogTemplate(message);
    this.modalContainer.setAttribute('data-open', true);
    document.body.setAttribute('data-scroll', false);

    const cancelButtons = this.dialogContainer.querySelectorAll('.cancel-dialog-button');
    const confirmButton = this.dialogContainer.querySelector('.confirm-dialog-button');

    this.modalContainerListener();

    return new Promise((resolve) => {
      for (const cancelButton of cancelButtons) {
        cancelButton.addEventListener('click', () => {
          this.closeDialog();
          resolve(false);
        });
      }

      confirmButton.addEventListener('click', () => {
        this.closeDialog();
        resolve(true);
      });
    });
  }

  static confirmDialogTemplate(message) {
    return `
      <header>
        <h2>Konfirmasi</h2>
        <button class="cancel-dialog-button" type="button" title="Tutup"><i class="fas fa-xmark"></i></button>
      </header>
      <section class="section-card-content">
        <p>${message}</p>
      </section>
      <footer>
        <button class="confirm-dialog-button button" type="button" title="Oke">Oke</button>
        <button class="cancel-dialog-button button-alternative" type="button" title="Batal">Batal</button>
      </footer>
    `;
  }
}

export default Dialog;
