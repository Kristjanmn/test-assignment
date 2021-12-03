import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from "@angular/material/dialog";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: Book;
  checkout: Checkout;

  isAvailable: boolean;
  isLate: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private checkoutService: CheckoutService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        if(params.id) {
          this.getBookById(params.id)
          this.checkoutService.getCheckoutByBookId(this.book.id)
            .subscribe(data => this.checkout = data, error => console.error(error));
        }
      })
  }

  getBookById(id: string) {
    this.bookService.getBook(id)
      .subscribe(data => {
        this.book = data;
        if(data.status == 'AVAILABLE') this.isAvailable = true;
      }, error => {
        console.error(error);
        if(error.status == 404) this.router.navigate(['books']);
      })
  }

  favorite(): void {
    // Toggle book as favorite or not.
    let favorites = [];
    if(localStorage.getItem('favoriteBooks')) {
      favorites = JSON.parse(localStorage.getItem('favoriteBooks'));
    }
    let index = favorites.indexOf(this.book.id);
    if(index > -1) favorites.splice(index, 1);
    else favorites.push(this.book.id);
    localStorage.setItem('favoriteBooks', JSON.stringify(favorites));
    console.error(favorites.length);
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
      .subscribe(data => this.router.navigate(['books', data]));
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
