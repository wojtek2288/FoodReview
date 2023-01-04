import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, SortDirection } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-base-search',
  templateUrl: './base-search.component.html',
  styleUrls: ['./base-search.component.css']
})
export class BaseSearchComponent<T> implements AfterViewInit {
  header: string = "";
  dataSource!: MatTableDataSource<T>;
  displayedColumns: string[] = ['id', 'name', 'description', 'showDetails'];
  sortingField: string = 'id';
  sortingDirection: SortDirection = "asc";
  totalItems: number = 0;
  searchFormControl = new FormControl('');
  constructor() { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();

  ngAfterViewInit() {
    this.paginator.page.subscribe(x => this.onSearch())
    this.empTbSort.sortChange.subscribe(x => {
      this.sortingField = x.active;
      this.sortingDirection = x.direction;
      this.onSearch();
    });
    this.onSearch();
  }

  onSearch() { }
}