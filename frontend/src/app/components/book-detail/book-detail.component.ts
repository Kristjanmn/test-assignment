import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  isDataLoaded: Promise<boolean>;
  book: Book;
  checkout: Checkout;

  isAvailable: boolean;
  isFavorite: boolean;
  favorites: string[] = [];

  constructor(
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private checkoutService: CheckoutService,
    private dialog: MatDialog
  ) {this.loaderService.isLoading.next(true);}

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        if(params.id) {
          this.getBookById(params.id);
        }
      });
  }

  getBookById(id: string) {
    this.bookService.getBook(id)
      .subscribe(data => {
        this.book = data;
        if(data.status == 'AVAILABLE') this.isAvailable = true;
        if(localStorage.getItem('favoriteBooks')) {
          this.favorites = JSON.parse(localStorage.getItem('favoriteBooks'));
          if(this.favorites.indexOf(this.book.id) > -1) this.isFavorite = true;
        }
        if(data.status == 'BORROWED') this.getCheckoutByBookId(data.id);
        /* https://stackoverflow.com/a/44904470 */
        this.isDataLoaded = Promise.resolve(true);
        this.loaderService.isLoading.next(false);
      }, () => this.router.navigate(['books']));
  }

  getCheckoutByBookId(id: string) {
    this.checkoutService.getCheckoutByBookId(id)
      .subscribe(data => this.checkout = data, () => this.router.navigate(['books']));
  }

  favorite(): void {
    // Toggle book as favorite or not.
    let index = this.favorites.indexOf(this.book.id);
    if(index > -1) {
      this.favorites.splice(index, 1);
      this.isFavorite = false;
    } else {
      this.favorites.push(this.book.id);
      this.isFavorite = true;
    }
    localStorage.setItem('favoriteBooks', JSON.stringify(this.favorites));
  }

  toBookCheckout(): void {
    this.router.navigate(['bookcheckout', this.book.id]);
  }

  openReturnDialog(): void {
    const dialogRef = this.dialog.open(BookReturnDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) this.returnBook()
    })
  }

  returnBook(): void {
    this.bookService.returnBook(this.book)
      .subscribe(() => this.router.navigate(['books']));
  }

  toBookEditing(): void {
    this.router.navigate(['bookedit', this.book.id]);
  }


  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(BookDeleteDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) this.delete();
    }, error => console.error(error));
  }

  delete(): void {
    this.bookService.deleteBook(this.book.id)
      .subscribe(() => this.router.navigate(['books']));
  }

}

@Component({
  selector: 'book-detail-delete-dialog',
  templateUrl: './book-detail-delete-dialog.html'
})
export class BookDeleteDialog {}

@Component({
  selector: 'book-detail-return-dialog',
  templateUrl: './book-detail-return-dialog.html'
})
export class BookReturnDialog {}
