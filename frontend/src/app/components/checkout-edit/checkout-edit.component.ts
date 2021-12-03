import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-book-edit',
  templateUrl: './checkout-edit.component.html'
})
export class CheckoutEditComponent implements OnInit {
  checkout: Checkout;
  status: string;
  // I know that there are better ways to do it.
  statusList: string[] = ["Borrowed","Returned"];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        if(params.id) {
          this.getCheckoutById(params.id);
        }
      })
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
      }, error => {
        console.error(error);
        if(error.status == 404) this.router.navigate(['checkouts']);
      })
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

  onReturnedDateChanged() {
    if(this.checkout.returnedDate.trim() == "") this.status = this.statusList[0];   // set to 'borrowed'
    else this.status = this.statusList[1];    // set to 'returned'
  }

  onStatusChanged() {
    // Borrowed
    if(this.status == this.statusList[0]) this.checkout.returnedDate = null;
    // Returned
    if(this.status == this.statusList[1]) this.checkout.returnedDate = Date.now().toString();
  }
}

@Component({
  selector: 'checkout-edit-update-dialog',
  templateUrl: './checkout-edit-update-dialog.html'
})
export class CheckoutEditDialog {}
