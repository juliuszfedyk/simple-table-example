import { Item } from './../models/item.model';
import { Injectable } from '@angular/core';
import data from '../../assets/table-data.json';

@Injectable({
  providedIn: 'root'
})
export class TableDataService {
  public items: Item[];
  public title: string;

  constructor() {
    this.items = data.tableData;
    this.title = data.headline;
  }
}
