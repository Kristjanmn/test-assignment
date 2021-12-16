import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-book-edit',
  templateUrl: './checkout-edit.component.html'
})
export class CheckoutEditComponent implements OnInit {
  isDataLoaded: Promise<boolean>;
  checkout: Checkout;
  status: string;
  // I know that there are better ways to do it.
  statusList: string[] = ["Borrowed","Returned"];
  // Dates
  inputCheckoutDate: string;
  inputDueDate: string;
  inputReturnedDate: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        if(params.id) {
          this.getCheckoutById(params.id);
        }
      });
  }

  getCheckoutById(id: string) {
    this.checkoutService.getCheckout(id)
      .subscribe(data => {
        this.checkout = data;
        // Borrowed
        if(this.checkout.returnedDate == null ||
          this.checkout.returnedDate.trim() == "") status = this.statusList[0];
        // Returned
        else status = this.statusList[1];
        this.inputCheckoutDate = data.checkedOutDate;
        this.inputDueDate = data.dueDate;
        this.inputReturnedDate = data.returnedDate;
        /* https://stackoverflow.com/a/44904470 */
        this.isDataLoaded = Promise.resolve(true);
      }, () => this.router.navigate(['checkouts']));
  }

  openUpdateDialog(): void {
    const dialogRef = this.dialog.open(CheckoutEditDialog);
    dialogRef.afterClosed().subscribe(result => {
      if(result == true) this.updateCheckout();
    })
  }

  updateCheckout(): void {
    this.checkoutService.saveCheckout(this.checkout).subscribe(() => {});
  }

  toBookDetails(): void {
    this.router.navigate(['books', this.checkout.borrowedBook.id]);
  }

  toCheckoutDetails(): void {
    this.router.navigate(['checkouts', this.checkout.id]);
  }

  onCheckoutDateChanged() {
    /* https://stackoverflow.com/a/40460346 */
    this.checkout.checkedOutDate = this.datePipe.transform(this.inputCheckoutDate, 'yyyy-MM-dd');
  }

  onDueDateChanged() {
    this.checkout.dueDate = this.datePipe.transform(this.inputDueDate, 'yyyy-MM-dd');
  }

  onReturnedDateChanged() {
    this.checkout.returnedDate = this.datePipe.transform(this.inputReturnedDate, 'yyyy-MM-dd');
    if(this.checkout.returnedDate.trim() == "") this.status = this.statusList[0];   // set to 'borrowed'
    else this.status = this.statusList[1];    // set to 'returned'
  }

  onStatusChanged() {
    // Borrowed
    if(this.status == this.statusList[0]) this.checkout.returnedDate = null;
    // Returned
    this.checkout.returnedDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
  }
}

@Component({
  selector: 'checkout-edit-update-dialog',
  templateUrl: './checkout-edit-update-dialog.html'
})
export class CheckoutEditDialog {}
