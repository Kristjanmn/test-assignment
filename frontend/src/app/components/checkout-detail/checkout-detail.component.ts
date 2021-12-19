import {ActivatedRoute, Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {CheckoutService} from "../../services/checkout.service";
import {Checkout} from "../../models/checkout";
import {LoaderService} from "../../services/loader.service";

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html'
})
export class CheckoutDetailComponent implements OnInit {
  isDataLoaded: Promise<boolean>;
  checkout: Checkout;
  checkoutStatus: CheckoutStatus;

  constructor(
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private checkoutService: CheckoutService,
  ) {this.loaderService.isLoading.next(true);}

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        if(params.id) this.getCheckoutById(params.id);
      })
  }

  getCheckoutById(id: string) {
    this.checkoutService.getCheckout(id)
      .subscribe(data => {
        this.checkout = data;
        // Status
        if(this.checkout.returnedDate == null ||
          this.checkout.returnedDate.trim() == "") {
          if(this.isBookLate()) this.checkoutStatus = CheckoutStatus.LATE;
          else this.checkoutStatus = CheckoutStatus.BORROWED;
        } else {
          if(this.isLateReturn()) this.checkoutStatus = CheckoutStatus.LATERETURN;
          else this.checkoutStatus = CheckoutStatus.RETURNED;
        }
        /* https://stackoverflow.com/a/44904470 */
        this.isDataLoaded = Promise.resolve(true);
        this.loaderService.isLoading.next(false);
      }, () => this.router.navigate(['checkouts']));
  }

  toBookDetails(): void {
    this.router.navigate(['books', this.checkout.borrowedBook.id]);
  }

  toCheckoutEditing(): void {
    this.router.navigate(['checkoutedit', this.checkout.id]);
  }

  isBookLate(): boolean {
    return this.checkoutService.isBookLate(this.checkout);
  }

  isLateReturn(): boolean {
    return this.checkoutService.isLateReturn(this.checkout);
  }
}

enum CheckoutStatus {
  "BORROWED" = "Borrowed",
  "RETURNED" = "Returned",
  "LATE" = "Late",
  "LATERETURN" = "Late return"
}
