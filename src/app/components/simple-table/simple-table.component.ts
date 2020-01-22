import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, debounceTime } from 'rxjs/operators';

import { TableDataService } from './../../services/table-data.service';
import { Item } from './../../models/item.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-simple-table',
  templateUrl: './simple-table.component.html',
  styleUrls: ['./simple-table.component.scss'],
})
export class SimpleTableComponent implements OnInit, OnDestroy {
  private searchFieldSubscription: Subscription;
  private items: Item[];
  private _currentPage = 1;
  public get currentPage(): number {
    return this._currentPage;
  }
  public set currentPage(pageNumber: number) {
    this._currentPage = pageNumber;
    this.updatePages();
  }
  public itemsPerPage = 20;
  public pages: number[];

  public dateFormat = 'yyyy-MM-dd';
  public filteredItems: Item[];
  public sortedBy: string;
  public filterField: FormControl;
  public get page(): Item[] {
    if (this.filteredItems.length <= this.itemsPerPage) {
      return this.filteredItems;
    } else {
      const startIndex = this.currentPage * this.itemsPerPage - 1;
      const endIndex =
        startIndex + this.itemsPerPage > this.filteredItems.length - 1
          ? this.filteredItems.length - 1
          : startIndex + this.itemsPerPage;
      return this.filteredItems.slice(startIndex, endIndex);
    }
  }

  constructor(
    private tableDataService: TableDataService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.filteredItems = this.items = this.tableDataService.items;
    this.sortByColumn('id');
    this.filterField = new FormControl(null);
    this.searchFieldSubscription = this.filterField.valueChanges
      .pipe(
        debounceTime(200),
        filter((filterValue: string) => !filterValue || filterValue.length > 2)
      )
      .subscribe(this.applyFilter.bind(this));
    this.currentPage = 1;
  }

  sortByColumn(propertyName: string) {
    this.filteredItems = this.filteredItems.sort((firstItem: Item, secondItem: Item) => {
      this.sortedBy = propertyName;
      if (typeof firstItem[propertyName] === 'number') {
        return firstItem[propertyName] - secondItem[propertyName];
      } else {
        return firstItem[propertyName].localeCompare(secondItem[propertyName]);
      }
    });
  }

  applyFilter(filterValue: string) {
    if (!filterValue) {
      this.filteredItems = this.items;
    } else {
      this.filteredItems = this.items.filter((item: Item) => {
        /**
         * It's generally better to do separate filters for date ( a nice date range picker);
         */
        let contains = false;
        const entries = Object.entries(item);
        for (let [key, value] of entries) {
          if (contains) {
            break;
          }
          if (key === 'date') {
            value = this.datePipe.transform(value, this.dateFormat);
          }
          const stringValue: string = value.toString();
          contains = stringValue.indexOf(filterValue) > -1;
        }
        return contains;
      });
    }
    this.updatePages();
  }
  pagesTrackBy(index: number) {
    return index;
  }

  public updatePages() {
    const pagesAmount = Math.ceil(
      this.filteredItems.length / this.itemsPerPage
    );
    const arr = [];
    for (let i = 0; i < pagesAmount; i++) {
      arr.push(i + 1);
    }
    if (arr.length > 9) {
      let startIndex = this.currentPage - 5;
      startIndex = startIndex > 0 ? startIndex : 0;
      startIndex = arr.length - startIndex < 5 ? arr.length - 9 : startIndex;
      this.pages = arr.slice(startIndex, startIndex + 9);
    } else {
      this.pages = arr;
    }
  }
  ngOnDestroy() {
    if (this.searchFieldSubscription) {
      this.searchFieldSubscription.unsubscribe();
    }
  }
}
