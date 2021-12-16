import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import {
  BooksListComponent,
  BooksListFavoritesDialog
} from './components/books-list/books-list.component';
import {BookDeleteDialog, BookDetailComponent, BookReturnDialog} from './components/book-detail/book-detail.component';
import { HttpClientModule } from '@angular/common/http';
import { CheckoutsListComponent } from "./components/checkouts-list/checkouts-list.component";
import { CheckoutDetailComponent } from "./components/checkout-detail/checkout-detail.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BookEditComponent, BookEditDialog, BookNewDialog} from "./components/book-edit/book-edit.component";
import {BookCheckoutComponent, BookCheckoutDialog} from "./components/book-checkout/book-checkout.component";
import {CheckoutEditComponent, CheckoutEditDialog} from "./components/checkout-edit/checkout-edit.component";
import {DatePipe} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    BooksListComponent,
    BooksListFavoritesDialog,
    BookDetailComponent,
    BookCheckoutComponent,
    BookCheckoutDialog,
    BookDeleteDialog,
    BookEditComponent,
    BookEditDialog,
    BookNewDialog,
    BookReturnDialog,
    CheckoutsListComponent,
    CheckoutDetailComponent,
    CheckoutEditComponent,
    CheckoutEditDialog
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
