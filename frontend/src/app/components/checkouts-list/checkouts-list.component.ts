import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html'
})
export class CheckoutsListComponent implements OnInit {
  allCheckouts: Checkout[];
  sortedCheckouts: Checkout[];
  dataSource: MatTableDataSource<Checkout>;
  displayedColumns: string[] = ["bookTitle", "firstName", "lastName"];

  // sorting
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private checkoutService: CheckoutService,
  ) {}

  ngOnInit(): void {
    // TODO this observable should emit books taking into consideration pagination, sorting and filtering options.
    /*this.books$ = this.bookService.getBooks({})
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Book>(data.content);
      })*/
    this.getCheckouts();
  }

  getCheckouts(): void {
    this.checkoutService.getCheckouts()
      .subscribe(data => {
        this.allCheckouts = data.content;
        this.dataSource = new MatTableDataSource<Checkout>(this.allCheckouts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error => console.error(error));
  }

  sortCheckouts(sort: Sort): void {
    // Return to first page
    this.dataSource.paginator.firstPage();

    if(!sort.active || sort.direction === '') {
      this.sortedCheckouts = this.allCheckouts;
      return;
    }

    this.sortedCheckouts = this.allCheckouts.slice().sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        default:
          return 0;
        case 'bookTitle':
          return this.compare(a.borrowedBook.title, b.borrowedBook.title, isAsc);
        case 'firstName':
          return this.compare(a.borrowerFirstName, b.borrowerFirstName, isAsc);
        case 'lastName':
          return this.compare(a.borrowerLastName, b.borrowerLastName, isAsc);
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
