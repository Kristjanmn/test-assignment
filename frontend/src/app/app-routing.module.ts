import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { CheckoutsListComponent } from './components/checkouts-list/checkouts-list.component';
import { CheckoutDetailComponent } from "./components/checkout-detail/checkout-detail.component";
import {BookEditComponent} from "./components/book-edit/book-edit.component";
import {BookCheckoutComponent} from "./components/book-checkout/book-checkout.component";
import {CheckoutEditComponent} from "./components/checkout-edit/checkout-edit.component";

const routes: Routes = [
  {path: '', redirectTo: 'books', pathMatch: 'full'},
  {path: 'books', component: BooksListComponent},
  {path: 'books/:id', component: BookDetailComponent},
  {path: 'bookcheckout/:id', component: BookCheckoutComponent},   // bad names
  {path: 'bookedit/:id', component: BookEditComponent},
  {path: 'checkouts', component: CheckoutsListComponent},
  {path: 'checkouts/:id', component: CheckoutDetailComponent},
  {path: 'checkoutedit/:id', component: CheckoutEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
