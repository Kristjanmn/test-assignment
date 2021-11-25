import {Component, OnInit, ViewChild} from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {BookStatus} from "../../models/book-status";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  allBooks: Book[];
  sortedBooks: Book[];
  dataSource: MatTableDataSource<Book>;
  displayedColumns: string[] = ["title", "author", "genre", "year"];
  selectedBook: Book;
  selectedIndex: number;

  // Filter
  filterTitle: string = "";
  filterAuthor: string = "";
  filterYearMin: number = 1900;
  filterYearMax: number = 2022;
  filterStatus: BookStatus = "AVAILABLE";
  filteredBooks: Book[];

  // sorting
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private bookService: BookService,
  ) {}

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    /*this.books$ = this.bookService.getBooks({})
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Book>(data.content);
      })*/
    this.getBooks();
    //this.getBooksByFilter("AVAILABLE");
  }

  getBooks(): void {
    this.bookService.getBooks({})
      .subscribe(data => {
        this.allBooks = data.content;
        this.filteredBooks = data.content;
        this.dataSource = new MatTableDataSource<Book>(this.filteredBooks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => console.error(error));
  }

  applyFilter(): void {
    console.error("update flter");
    this.dataSource.paginator.firstPage();
    this.filteredBooks = [];
    for(let book of this.allBooks) {
      if(book.title.includes(this.filterTitle) &&
        book.author.includes(this.filterAuthor) &&
        ((book.year >= this.filterYearMin) && (book.year <= this.filterYearMax)) &&
      book.status == this.filterStatus) this.filteredBooks.push(book);
    }
    this.dataSource = new MatTableDataSource<Book>(this.filteredBooks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sortBooks(sort: Sort): void {
    // Return to first page
    this.dataSource.paginator.firstPage();

    if(!sort.active || sort.direction === '') {
      this.sortedBooks = this.filteredBooks;
      return;
    }

    this.sortedBooks = this.filteredBooks.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        default:
          return 0;
        case 'title':
          return this.compare(a.title, b.title, isAsc);
        case 'author':
          return this.compare(a.author, b.author, isAsc);
        case 'year':
          return this.compare(a.year, b.year, isAsc);
        case 'genre':
          return this.compare(a.genre, b.genre, isAsc);
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setSelected(book: Book, index: number): void {

    if(this.selectedBook && this.selectedBook.id == book.id) {
      this.selectedBook = undefined;
      this.selectedIndex = -1;
    } else {
      this.selectedBook = book;
      this.selectedIndex = index;
    }
  }

}
