import Theme from './classes/Theme.js';
import NavMenu from './classes/NavMenu.js';
import SectionCard from './classes/SectionCard.js';
import ModalContainer from './classes/ModalContainer.js';
import Bookshelf from './classes/Bookshelf.js';
import BookshelfView from './classes/BookshelfView.js';

document.addEventListener('DOMContentLoaded', () => {
  new Theme({
    themeToggler: document.querySelector('#theme-toggler'),
  });

  new NavMenu({
    openMenuButton: document.querySelector('#open-menu-button'),
    closeMenuButton: document.querySelector('#close-menu-button'),
    navMenuContainer: document.querySelector('header nav'),
  });

  new SectionCard({
    sectionCardTogglers: document.querySelectorAll('.section-card .hide-button'),
  });

  new ModalContainer({
    containers: document.querySelectorAll('.modal-container'),
  });

  new BookshelfView({
    bookshelf: new Bookshelf(),
    addBookForm: document.querySelector('#add-book form'),
    editBookFormContainer: document.querySelector('#edit-book > section'),
    filterBooksForm: document.querySelector('#filter-books form'),
    filtersContainer: document.querySelector('#filters ul'),
    uncompletedBooksContainer: document.querySelector('#uncompleted-books .section-card-content ul'),
    completedBooksContainer: document.querySelector('#completed-books .section-card-content ul'),
    cleanBooksButton: document.querySelector('#delete-books-button'),
  });
});
