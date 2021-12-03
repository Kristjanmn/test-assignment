import {Component, OnInit} from "@angular/core";
import {Book} from "../../models/book";
import {ActivatedRoute, Router} from "@angular/router";
import {BookService} from "../../services/book.service";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html'
})
export class BookEditComponent implements OnInit {
  book: Book;
  inputStatus: string;
  statusList: string[] = ['Available','Borrowed','Returned','Damaged','Processing'];

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
        switch (this.book.status) {
          case "AVAILABLE":
            this.inputStatus = "Available";
            break;
          case "BORROWED":
            this.inputStatus = "Borrowed";
            break;
          case "RETURNED":
            this.inputStatus = "Returned";
            break;
          case "DAMAGED":
            this.inputStatus = "Damaged";
            break;
          case "PROCESSING":
            this.inputStatus = "Processing";
            break;
        }
      }, error => {
        console.error(error);
        if(error.status == 404) this.router.navigate(['books']);
      })
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(BookEditDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) this.updateBook();
    })
  }

  updateBook(): void {
    this.bookService.saveBook(this.book).subscribe(() => {});
  }

  toBookDetails(): void {
    this.router.navigate(['books', this.book.id]);
  }

  toCheckoutDetails(): void {
    let checkoutId = "";
    this.checkoutService.getCheckoutByBookId(this.book.id)
      .subscribe(data => {
        checkoutId = data.id;
        console.error("checkout id: " + checkoutId);
        this.router.navigate(['checkouts', checkoutId]);
    }, error => console.error(error));
  }

  applyStatus(): void {
    switch (this.inputStatus) {
      case "Available":
        this.book.status = "AVAILABLE";
        break
      case "Borrowed":
        this.book.status = "BORROWED";
        break
      case "Returned":
        this.book.status = "RETURNED";
        break
      case "Damaged":
        this.book.status = "DAMAGED";
        break
      case "Processing":
        this.book.status = "PROCESSING";
        break
    }
  }
}

@Component({
  selector: 'book-edit-update-dialog',
  templateUrl: './book-edit-update-dialog.html'
})
export class BookEditDialog {}
