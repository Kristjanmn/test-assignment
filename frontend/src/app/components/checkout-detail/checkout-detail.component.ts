import {ActivatedRoute} from "@angular/router";
import {Component, OnInit} from "@angular/core";

@Component({
  selector: 'app-checkout-detail',
  templateUrl: './checkout-detail.component.html'
})
export class CheckoutDetailComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {}
}
