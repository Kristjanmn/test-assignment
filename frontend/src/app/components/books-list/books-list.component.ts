import {Component, OnInit, ViewChild} from '@angular/core';
import { BookService } from '../../services/book.service';
import { Subscription} from 'rxjs';
import { Book } from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {

  books$: Subscription; //Observable<Page<Book>>;
  allBooks: Book[];
  sortedBooks: Book[];
  dataSource: MatTableDataSource<Book>;
  displayedColumns: string[] = ["title", "author", "genre", "year"];

  // sorting
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private bookService: BookService,
  ) {
  }

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    /*this.books$ = this.bookService.getBooks({})
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Book>(data.content);
      })*/
    this.getBooks();
  }

  getBooks(): void {
    this.books$ = this.bookService.getBooks({})
      .subscribe(data => {
        this.allBooks = data.content;
        this.dataSource = new MatTableDataSource<Book>(this.allBooks);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => console.error(error));
  }

  sortBooks(sort: Sort): void {
    // Return to first page
    this.dataSource.paginator.firstPage();

    if(!sort.active || sort.direction === '') {
      this.sortedBooks = this.allBooks;
      return;
    }

    this.sortedBooks = this.allBooks.slice().sort((a, b) => {
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

  compare(a: number | string | undefined, b: number | string | undefined, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
