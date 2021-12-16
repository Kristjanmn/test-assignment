import {Component, OnInit} from "@angular/core";
import {Book} from "../../models/book";
import {ActivatedRoute, Router} from "@angular/router";
import {BookService} from "../../services/book.service";
import {MatDialog} from "@angular/material/dialog";
import {CheckoutService} from "../../services/checkout.service";
import {BookStatus} from "../../models/book-status";

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html'
})
export class BookEditComponent implements OnInit {
  isDataLoaded: Promise<boolean>;
  isNewBook: boolean;
  meetsRequirements: boolean;
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
          if(params.id != 'new') this.getBookById(params.id);
          else {
            this.isNewBook = true;
            this.book = new class implements Book {
              added: string;
              author: string;
              checkOutCount: number;
              comment: string;
              dueDate: string;
              genre: string;
              id: string;
              status: BookStatus = 'PROCESSING';
              title: string;
              year: number;
            }
            this.setBookStatus();
            this.isDataLoaded = Promise.resolve(true);
          }
        }
      });
  }

  getBookById(id: string) {
    this.bookService.getBook(id)
      .subscribe(data => {
        this.book = data;
        this.setBookStatus();
        this.checkRequirements();
        /* https://stackoverflow.com/a/44904470 */
        this.isDataLoaded = Promise.resolve(true);
      }, () => this.router.navigate(['books']));
  }

  setBookStatus(): void {
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

  openNewDialog(): void {
    const dialogRef = this.dialog.open(BookNewDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) this.createBook();
    })
  }

  createBook(): void {
    this.bookService.createBook(this.book).subscribe(response => {
      this.router.navigate(['bookedit', response.id]);
    });
  }

  // Back button
  backButtonPressed(): void {
    if(this.book.id == 'new') this.router.navigate(['books']);
    else this.router.navigate(['books', this.book.id]);
  }

  toCheckoutDetails(): void {
    let checkoutId = "";
    this.checkoutService.getCheckoutByBookId(this.book.id)
      .subscribe(data => {
        checkoutId = data.id;
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

  checkRequirements(): void {
    if(this.isBlank(this.book.title) ||
      this.isBlank(this.book.author) ||
      this.isBlank(this.book.genre) ||
      this.book.year == null) this.meetsRequirements = false;
    else this.meetsRequirements = true;
  }

  isBlank(s: string): boolean {
    if(s == null || s.trim() == "") return true;
    return false;
  }
}

@Component({
  selector: 'book-edit-update-dialog',
  templateUrl: './book-edit-update-dialog.html'
})
export class BookEditDialog {}

@Component({
  selector: 'book-edit-new-dialog',
  templateUrl: './book-edit-new-dialog.html'
})
export class BookNewDialog {}
