import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {BookService} from '../../services/book.service';
import {Book} from '../../models/book';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {SortDirection} from "../../models/page";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  dataSource: MatTableDataSource<Book>;
  displayedColumns: string[] = ["title", "author", "genre", "year"];
  selectedBook: Book;
  selectedIndex: number;

  // Filter
  filterYearMinDefault: number = 1900;
  filterYearMaxDefault: number = 2022;
  filterTitle: string;
  filterAuthor: string;
  filterYearMin: number = this.filterYearMinDefault;
  filterYearMax: number = this.filterYearMaxDefault;
  filterStatus: string = 'All';
  statusList: string[] = ['All','Available','Borrowed','Returned','Damaged','Processing'];
  favorites: string[] = [];

  // Sorting/paging
  sortColumn: string;
  sortDirection: SortDirection;
  totalElements: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private loaderService: LoaderService,
    private cdr: ChangeDetectorRef,
    private bookService: BookService,
    private router: Router,
    private dialog: MatDialog) {this.loaderService.isLoading.next(true);}

  ngOnInit(): void {
    this.bookService.getBooks({pageIndex: 0, pageSize: 10, fromYear: this.filterYearMin, toYear: this.filterYearMax})
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Book>(data.content);
        this.paginator.pageSize = data.number;
        this.totalElements = data.totalElements;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loaderService.isLoading.next(false);
      })
    // favorite books (not implemented)
    if(localStorage.getItem('favoriteBooks')) {
      this.favorites = JSON.parse(localStorage.getItem('favoriteBooks'));
    }
  }

  getBooks(): void {
    this.loaderService.isLoading.next(true);
    this.bookService.getBooks({pageIndex: this.paginator.pageIndex,
      pageSize: this.paginator.pageSize, sort: this.sortColumn, direction: this.sortDirection, title: this.filterTitle,
      author: this.filterAuthor, fromYear: this.filterYearMin, toYear: this.filterYearMax, status: this.filterStatus})
      .subscribe(data => {
        // Pagination
        this.dataSource = new MatTableDataSource<Book>(data.content);
        this.dataSource.sort = this.sort;
        this.totalElements = data.totalElements;
        this.loaderService.isLoading.next(false);
      }, error => console.error(error));
  }

  createBook(): void {
    this.router.navigate(['bookedit', 'new']);
  }

  applyFilter(): void {
    this.getBooks();
  }

  resetFilter(): void {
    this.filterTitle = "";
    this.filterAuthor = "";
    this.filterYearMin = this.filterYearMinDefault;
    this.filterYearMax = this.filterYearMaxDefault;
    this.filterStatus = "All";
    this.applyFilter();
  }

  sortBooks(sort: Sort): void {
    if(!sort.active || !sort.direction) {
      this.sortColumn = null;
      this.sortDirection = null;
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }
    this.getBooks();
  }

  /**
   * Set an row in table as selected. I have used this in another app
   * for showing additional information or display buttons when selecting
   * an row. But in this case I will just open the selected book page.
   *
   * @param book
   * @param index
   */
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

  openFavoritesList(): void {
    this.dialog.open(BooksListFavoritesDialog);
  }

}

@Component({
  selector: 'books-list-favorites-dialog',
  templateUrl: './books-list-favorites-dialog.html'
})
export class BooksListFavoritesDialog {
  favorites: Book[] = [];
}
