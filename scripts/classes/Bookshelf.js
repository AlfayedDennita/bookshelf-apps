import { STORAGE_KEYS } from '../constants.js';
import { isStorageExists } from '../functions.js';

class Bookshelf {
  constructor() {
    this._books = [];
    this._storageKeys = STORAGE_KEYS.BOOKS;

    this.init();
  }

  init() {
    this.loadBooksFromStorage();
  }

  get books() {
    return this._books;
  }

  generateBookId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomCharacters = '';
    const randomCharactersLength = 4;

    for (let i = 0; i < randomCharactersLength; i++) {
      randomCharacters += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return randomCharacters + +new Date();
  }

  saveBooksToStorage() {
    if (isStorageExists()) {
      const stringifyBooks = JSON.stringify(this._books);
      localStorage.setItem(this._storageKeys, stringifyBooks);
    } 
  }

  loadBooksFromStorage() {
    if (isStorageExists()) {
      const books = JSON.parse(localStorage.getItem(this._storageKeys));

      if (books) {
        for (const book of books) {
          this._books.push(book);
        }
      } else {
        this._books = [];
      }
    }
  }

  findBookById(id) {
    return this._books.filter((book) => book.id === id)[0];
  }

  filterBooks(filter, isExact = true) {
    const filteredBooks = this._books.filter((book) => {
      let matchConditions = [];

      if (isExact) {
        matchConditions = [
          filter.title ? filter.title.toLowerCase() === book.title.toLowerCase() : true,
          filter.author ? filter.author.toLowerCase() === book.author.toLowerCase() : true,
          filter.year ? filter.year === book.year : true,
        ];
      } else {
        matchConditions = [
          filter.title ? book.title.toLowerCase().indexOf(filter.title.toLowerCase()) >= 0 : true,
          filter.author ? book.author.toLowerCase().indexOf(filter.author.toLowerCase()) >= 0 : true,
          filter.startYear ? filter.startYear <= book.year : true,
          filter.endYear ? filter.endYear >= book.year : true,
        ];
      }

      return matchConditions.every(Boolean);
    });

    return filteredBooks;
  }

  addBook({ title, author, year, isComplete }) {
    const id = this.generateBookId();
    this._books.push({ id, title, author, year, isComplete});
    this.saveBooksToStorage();
  }

  toggleBookStatus(id) {
    this._books = this._books.map((book) => book.id === id ? {...book, isComplete: !book.isComplete} : book);
    this.saveBooksToStorage();
  }

  editBook(id, { title, author, year, isComplete }) {
    this._books = this._books.map((book) => book.id === id ? {...book, title, author, year, isComplete} : book);
    this.saveBooksToStorage();
  }

  removeBook(id) {
    this._books = this._books.filter((book) => book.id !== id);
    this.saveBooksToStorage();
  }

  cleanBooks() {
    if(isStorageExists()) {
      localStorage.setItem(this._storageKeys, null);
      this.loadBooksFromStorage();
    }
  }
}

export default Bookshelf;
