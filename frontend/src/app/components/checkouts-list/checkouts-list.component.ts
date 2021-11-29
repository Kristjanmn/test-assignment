import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html'
})
export class CheckoutsListComponent implements OnInit {
  allCheckouts: Checkout[];
  sortedCheckouts: Checkout[];
  dataSource: MatTableDataSource<Checkout>;
  displayedColumns: string[] = ["title", "firstName", "lastName", "checkoutDate", "dueDate"];
  selectedCheckout: Checkout;
  selectedIndex: number;

  // Filter
  filterBookTitle: string = "";
  filterName: string = "";
  filterStatus: string = "All";
  filteredCheckouts: Checkout[];
  statusList: string[] = ['All','Borrowed','Late','Returned'];

  // Sorting
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router
  ) {
  }

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
        this.filteredCheckouts = data.content;
        this.dataSource = new MatTableDataSource<Checkout>(this.filteredCheckouts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        /* https://stackoverflow.com/questions/48891174/angular-material-2-datatable-sorting-with-nested-objects */
        this.dataSource.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'borrowedBook.title': return item.borrowedBook.title;
            default: return item[property];
          }
        };
      }, error => console.error(error));
  }

  createCheckout(): void {
    //
  }

  applyFilter(): void {
    this.dataSource.paginator.firstPage();
    this.filteredCheckouts = [];
    for(let checkout of this.allCheckouts) {
      if(checkout.borrowedBook.title.toLowerCase().includes(this.filterBookTitle.toLowerCase()) &&
        (checkout.borrowerFirstName.toLowerCase().includes(this.filterName.toLowerCase()) ||
          checkout.borrowerLastName.toLowerCase().includes(this.filterName.toLowerCase())) &&
        (this.filterStatus == "All" /*|| book.status == this.filterStatus.toUpperCase()*/)) this.filteredCheckouts.push(checkout);
    }
    this.dataSource = new MatTableDataSource<Checkout>(this.filteredCheckouts);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  resetFilter(): void {
    this.filterBookTitle = "";
    this.filterName = "";
    this.filterStatus = "All";
    this.applyFilter();
  }

  sortCheckouts(sort: Sort): void {
    // Return to first page
    this.dataSource.paginator.firstPage();

    if(!sort.active || sort.direction === '') {
      this.sortedCheckouts = this.filteredCheckouts;
      return;
    }

    this.sortedCheckouts = this.filteredCheckouts.slice().sort((a, b) => {
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
        case 'checkoutDate':
          return this.compare(a.checkoutDate, b.checkoutDate, isAsc);
        case 'dueDate':
          return this.compare(a.dueDate, b.dueDate, isAsc);
      }
    });
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setSelected(checkout: Checkout, index: number): void {
    if(this.selectedCheckout && this.selectedCheckout.id == checkout.id) {
      this.selectedCheckout = undefined;
      this.selectedIndex = -1;
    } else {
      this.selectedCheckout = checkout;
      this.selectedIndex = index;
    }
    this.router.navigate(['checkouts', this.selectedCheckout.id])
  }

}
