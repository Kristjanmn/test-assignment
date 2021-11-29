import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  book: Book;

  isAvailable: boolean;
  isLate: boolean;
  localdate

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params
      .subscribe(params => {
        if(params.id) {
          this.getBookById(params.id)
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

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(BookDeleteDialog);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`${result}`);
      if(result == true) this.delete();
    }, error => console.error(error));
  }

  updateBook(): void {
    this.bookService.saveBook(this.book);
  }

  delete(): void {
    //TODO: disabled just for testing
    //this.bookService.deleteBook(this.book.id);
    this.router.navigate(['/books']);
  }

}

@Component({
  selector: 'book-detail-delete-dialog',
  templateUrl: './book-detail-delete-dialog.html'
})
export class BookDeleteDialog {}
