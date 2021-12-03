import {Component, OnInit} from "@angular/core";
import {Book} from "../../models/book";
import {ActivatedRoute, Router} from "@angular/router";
import {BookService} from "../../services/book.service";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-book-checkout',
  templateUrl: './book-checkout.component.html'
})
export class BookCheckoutComponent implements OnInit {
  book: Book;
  inputFirstName: string = "";
  inputLastName: string = "";
  inputDueDate: string;
  meetsRequirements = false;

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
          this.getBookById(params.id);
        }
      })
  }

  getBookById(id: string) {
    this.bookService.getBook(id)
      .subscribe(data => {
        this.book = data;
      }, error => {
        console.error(error);
        if(error.status == 404) this.router.navigate(['books']);
      })
  }

  openCheckoutConfirmDialog(): void {
    const dialogRef = this.dialog.open(BookCheckoutDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) this.checkoutBook();
    })
  }

  checkoutBook(): void {
    this.checkoutService.createCheckout(this.book.id, this.inputFirstName, this.inputLastName, this.inputDueDate)
      .subscribe(data => this.router.navigate(['checkouts', data.id]));
  }

  toBookDetails(): void {
    this.router.navigate(['books', this.book.id]);
  }

  fieldsChanged(): void {
    if (this.inputFirstName.trim() == "" ||
      this.inputLastName.trim() == "") this.meetsRequirements = false;
    else this.meetsRequirements = true;
  }
}

@Component({
  selector: 'book-checkout-dialog',
  templateUrl: './book-checkout-dialog.html'
})
export class BookCheckoutDialog {}
