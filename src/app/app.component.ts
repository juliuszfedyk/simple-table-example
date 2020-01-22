import { TableDataService } from './services/table-data.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public titleText: string;
  constructor(
    private title: Title,
    private tableDataService: TableDataService
  ) {}
  ngOnInit() {
    this.titleText = this.tableDataService.title;
    this.title.setTitle(this.titleText);
  }
}
