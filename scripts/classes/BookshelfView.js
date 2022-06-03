import Dialog from "./Dialog.js";

class BookshelfView {
  constructor({ bookshelf, addBookForm, editBookFormContainer, filterBooksForm, filtersContainer, uncompletedBooksContainer, completedBooksContainer, cleanBooksButton }) {
    this._bookshelf = bookshelf;
    this._books = [];
    this._filters = {};

    this._addBookForm = addBookForm;
    this._editBookFormContainer = editBookFormContainer;
    this._filterBooksForm = filterBooksForm;
    this._filtersContainer = filtersContainer;
    this._uncompletedBooksContainer = uncompletedBooksContainer;
    this._completedBooksContainer = completedBooksContainer;
    this._cleanBooksButton = cleanBooksButton;

    this.init();
  }

  init() {
    this.renderBookCards();

    this.addBookFormListener();
    this.filterBooksFormListener();
    this.cleanBooksButtonListener();
  }

  loadBooks() {
    const filtersOuterContainer = this._filtersContainer.closest('.container-small');

    if (Object.keys(this._filters).length > 0) {
      this._books = this._bookshelf.filterBooks(this._filters, false);
      this.renderFilterPills();
      filtersOuterContainer.setAttribute('data-show', true);
    } else {
      this._books = this._bookshelf.books;
      filtersOuterContainer.removeAttribute('data-show');
    }
  }

  renderFilterPills() {
    this._filtersContainer.innerHTML = '';
    
    for (const [filterName, filterValue] of Object.entries(this._filters)) {
      this._filtersContainer.innerHTML += this.filterPillTemplate(filterName, filterValue);
    }
  }

  filterPillTemplate(filterName, filterValue) {
    const filterNamesInID = {
      'title': 'Judul',
      'author': 'Penulis',
      'startYear': 'Tahun Terbit (Dari)',
      'endYear': 'Tahun Terbit (Sampai)',
    };
    
    const filterNameInID = filterNamesInID[filterName];

    return `
      <li><b>${filterNameInID}:</b> ${filterValue}</li>
    `;
  }

  addBookFormListener() {
    this._addBookForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const book = {
        title: this._addBookForm.querySelector('input[name="title"]').value,
        author: this._addBookForm.querySelector('input[name="author"]').value,
        year: Number(this._addBookForm.querySelector('input[name="year"]').value),
        isComplete: this._addBookForm.querySelector('input[name="isComplete"]').checked,
      };

      let isUserConfirmed = true;

      if (this._bookshelf.filterBooks({ title: book.title, author: book.author }).length > 0) {
        isUserConfirmed = await Dialog.confirm(`Buku dengan judul "${book.title}" oleh "${book.author}" telah tersimpan di aplikasi. Apakah kamu yakin ingin menambahkan buku "${book.title}" lagi?`);
      }

      if (isUserConfirmed) {
        this._bookshelf.addBook(book);
        this._addBookForm.reset();
        this.renderBookCards();
  
        if (book.isComplete) {
          this._completedBooksContainer.scrollIntoView();
        } else {
          this._completedBooksContainer.scrollIntoView();
        }
      }
    });
  }

  filterBooksFormListener() {
    this._filterBooksForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const inputValue = {
        title: this._filterBooksForm.querySelector('input[name="title"]').value,
        author: this._filterBooksForm.querySelector('input[name="author"]').value,
        startYear: Number(this._filterBooksForm.querySelector('input[name="startYear"]').value),
        endYear: Number(this._filterBooksForm.querySelector('input[name="endYear"]').value),
      };

      let filters = {};

      for (const [filterName, filterValue] of Object.entries(inputValue)) {
        if (filterValue) {
          filters[filterName] = filterValue; 
        }
      }

      if (Object.keys(filters).length > 0) {
        this._filters = filters;
      } else {
        this._filters = {};
      }

      this.renderBookCards();

      if (Object.keys(this._filters).length > 0) {
        this._uncompletedBooksContainer.scrollIntoView();
      }
    });

    this._filterBooksForm.addEventListener('reset', () => {
      this._filters = {};
      this.renderBookCards();
    });
  }

  toggleBookStatus(id) {
    this._bookshelf.toggleBookStatus(id);
    this.renderBookCards();
  }

  editBook(id) {
    const book = this._bookshelf.findBookById(id);

    this._editBookFormContainer.innerHTML = this.editBookFormTemplate();

    const editBookForm = this._editBookFormContainer.querySelector('form');
    const editBookModal = this._editBookFormContainer.closest('.modal-container');

    editBookModal.setAttribute('data-open', true);

    const closeButtons = editBookModal.querySelectorAll('.close-modal-button');

    for (const closeButton of closeButtons) {
      closeButton.addEventListener('click', () => editBookModal.removeAttribute('data-open'));
    }

    const input = {
      title: editBookForm.querySelector('input[name="title"]'),
      author: editBookForm.querySelector('input[name="author"]'),
      year: editBookForm.querySelector('input[name="year"]'),
      isComplete: editBookForm.querySelector('input[name="isComplete"]'),
    }

    input.title.value = book.title;
    input.author.value = book.author;
    input.year.value = book.year;
    if (book.isComplete) {
      input.isComplete.checked = true; 
    }

    editBookForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const newBook = {
        title: input.title.value,
        author: input.author.value,
        year: Number(input.year.value),
        isComplete: input.isComplete.checked,
      };

      this._bookshelf.editBook(id, newBook);

      this.renderBookCards();
      editBookModal.removeAttribute('data-open');
    });
  }

  editBookFormTemplate() {
    return `
      <form action="" method="post">
        <label class="input-group" title="Judul Buku">
          Judul
          <input type="text" name="title" required>
        </label>
        <label class="input-group" title="Penulis Buku">
          Penulis
          <input type="text" name="author" required>
        </label>
        <label class="input-group" title="Tahun Terbit Buku">
          Tahun Terbit
          <input type="number" name="year" min="1" max="2999" required>
        </label>
        <label class="input-group-horizontal" title="Buku telah selesai dibaca">
          <input type="checkbox" name="isComplete">
          Buku telah selesai dibaca
        </label>
        <section class="form-buttons">
          <button class="close-modal-button button-alternative" type="button" title="Batal Edit"><i class="fas fa-xmark"></i> Batal Edit</button>
          <button class="button" type="submit" title="Edit Buku"><i class="fas fa-pen"></i> Edit Buku</i></button>
        </section>
      </form>
    `;
  }

  async removeBook(id) {
    const bookTitle = this._bookshelf.findBookById(id).title;
    const isUserConfirmed = await Dialog.confirm(`Apakah kamu yakin ingin menghapus buku "${bookTitle}" dari semua rak buku? Buku yang dihapus tidak dapat dikembalikan.`);

    if (isUserConfirmed) {
      this._bookshelf.removeBook(id);
      this.renderBookCards();
    }
  }

  cleanBooksButtonListener() {
    this._cleanBooksButton.addEventListener('click', async () => {
      const isUserConfirmed = await Dialog.confirm(`Apakah kamu yakin ingin menghapus semua buku yang tersimpan? Buku yang dihapus tidak dapat dikembalikan.`);

      if (isUserConfirmed) {
        this._bookshelf.cleanBooks();
        this.renderBookCards();
        Dialog.alert('Semua buku telah berhasil dihapus!');
      }
    });
  }

  renderBookCards() {
    this.loadBooks();

    this._uncompletedBooksContainer.innerHTML = '';
    this._completedBooksContainer.innerHTML = '';

    for (const book of this._books) {
      if (book.isComplete) {
        this._completedBooksContainer.innerHTML += this.bookCardTemplate(book);
      } else {
        this._uncompletedBooksContainer.innerHTML += this.bookCardTemplate(book);
      }
    }

    this.bookCardActionsListener();
  }

  bookCardActionsListener() {
    const uncompletedBookCards = this._uncompletedBooksContainer.querySelectorAll('li[data-id]');
    const completedBookCards = this._completedBooksContainer.querySelectorAll('li[data-id]');
    const bookCards = [...uncompletedBookCards, ...completedBookCards];

    for (const bookCard of bookCards) {
      const bookId = bookCard.getAttribute('data-id');
      const completeToggler = bookCard.querySelector('.complete-toggler');
      const editButton = bookCard.querySelector('.edit-book-button');
      const removeButton = bookCard.querySelector('.remove-book-button');

      completeToggler.addEventListener('click', () => this.toggleBookStatus(bookId));
      editButton.addEventListener('click', () => this.editBook(bookId));
      removeButton.addEventListener('click', () => this.removeBook(bookId));
    }
  }

  bookCardTemplate({ id, title, author, year, isComplete }) {
    const completeTogglerTitle = isComplete ? 'Tandai Belum Selesai Dibaca' : 'Tandai Telah Selesai Dibaca';
    const completeTogglerIcon = isComplete ? 'fas fa-rotate-left' : 'fas fa-check';

    return `
      <li class="book-card" data-id="${id}">
        <div class="book-info">
          <h3 class="book-title">${title}</h3>
          <p class="book-description">${author} - ${year}</p>
        </div>
        <div class="book-actions">
          <button class="complete-toggler" type="button" title="${completeTogglerTitle}"><i class="${completeTogglerIcon} fa-fw"></i></button>
          <button class="edit-book-button" type="button" title="Edit Buku"><i class="fas fa-pen fa-fw"></i></button>
          <button class="remove-book-button" type="button" title="Hapus Buku"><i class="fas fa-trash fa-fw"></i></button>
        </div>
      </li>
    `;
  }
}

export default BookshelfView;
