import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort, Sort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {Checkout} from "../../models/checkout";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {SortDirection} from "../../models/page";

@Component({
  selector: 'app-checkouts-list',
  templateUrl: './checkouts-list.component.html'
})
export class CheckoutsListComponent implements OnInit, AfterViewInit {
  dataSource: MatTableDataSource<Checkout>;
  displayedColumns: string[] = ["title", "firstName", "lastName", "checkoutDate", "dueDate"];
  selectedCheckout: Checkout;
  selectedIndex: number;

  // Filter
  filterBookTitle: string;
  filterName: string;
  filterStatus: string = "All";
  statusList: string[] = ['All','Borrowed','Late','Returned'];

  // Sorting/paging
  sortColumn: string;
  sortDirection: SortDirection;
  totalElements: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.checkoutService.getCheckouts({pageIndex: 0, pageSize: 10})
      .subscribe(data => {
        this.dataSource = new MatTableDataSource<Checkout>(data.content);
        this.paginator.pageSize = data.number;
        this.totalElements = data.totalElements;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  ngAfterViewInit(): void {

  }

  getCheckouts(): void {
    this.checkoutService.getCheckouts({pageIndex: this.paginator.pageIndex, pageSize: this.paginator.pageSize, sort: this.sortColumn,
      direction: this.sortDirection, title: this.filterBookTitle, name: this.filterName, status: this.filterStatus})
      .subscribe(data => {
        // Pagination
        this.dataSource = new MatTableDataSource<Checkout>(data.content);
        this.dataSource.sort = this.sort;
        this.totalElements = data.totalElements;
      }, error => console.error(error));
  }

  applyFilter(): void {
    this.getCheckouts();
  }

  resetFilter(): void {
    this.filterBookTitle = "";
    this.filterName = "";
    this.filterStatus = "All";
    this.applyFilter();
  }

  sortCheckouts(sort: Sort): void {
    if(!sort.active || !sort.direction) {
      this.sortColumn = null;
      this.sortDirection = null;
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction;
    }
    this.getCheckouts();
  }

  /**
   * Set an row in table as selected. I have used this in another app
   * for showing additional information or display buttons when selecting
   * an row. But in this case I will just open the selected checkout page.
   *
   * @param checkout
   * @param index
   */
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

  isLate(dueDate: string, returnedDate: string): boolean {
    // This calculations seems wrong, but it works
    if(returnedDate != null && returnedDate.trim() != "") return false;
    return new Date() > new Date(dueDate);
  }

}
