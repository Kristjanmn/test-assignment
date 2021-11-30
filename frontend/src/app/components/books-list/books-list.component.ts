import {Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";

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
  filterStatus: string = 'All';
  filteredBooks: Book[];
  // Filter limits
  filterYearMinLimit: number = 1900;
  filterYearMaxLimit: number = 2022;
  statusList: string[] = ['All','Available','Borrowed','Returned','Damaged','Processing'];

  // Sorting
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private bookService: BookService,
    private router: Router) {}

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    /*this.books$ = this.bookService.getBooks({})
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Book>(data.content);
      })*/
    this.getBooks();
  }

  getBooks(): void {
    // This is really STUPID. I have no idea how this works :'(
    this.bookService.getBooks({ pageSize:999999999})
      .subscribe(data => {
        this.allBooks = data.content;
        this.filteredBooks = data.content;
        this.dataSource = new MatTableDataSource<Book>(this.filteredBooks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => console.error(error));
  }

  createBook(): void {
    this.bookService.createBook()
      .subscribe(data => {
        this.router.navigate(['books', data.id]);
      }, error => console.error(error));
  }

  applyFilter(): void {
    this.dataSource.paginator.firstPage();
    this.filteredBooks = [];
    for(let book of this.allBooks) {
      if(book.title.toLowerCase().includes(this.filterTitle.toLowerCase()) &&
        book.author.toLowerCase().includes(this.filterAuthor.toLowerCase()) &&
        ((book.year >= this.filterYearMin) && (book.year <= this.filterYearMax)) &&
        (this.filterStatus == "All" || book.status == this.filterStatus.toUpperCase())) this.filteredBooks.push(book);
    }
    this.dataSource = new MatTableDataSource<Book>(this.filteredBooks);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  resetFilter(): void {
    this.filterTitle = "";
    this.filterAuthor = "";
    this.filterYearMin = this.filterYearMinLimit;
    this.filterYearMax = this.filterYearMaxLimit;
    this.filterStatus = "All";
    this.applyFilter();
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
    this.router.navigate(['books', this.selectedBook.id]);
  }

}
