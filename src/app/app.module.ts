import { DatePipe } from '@angular/common';
import { TableDataService } from './services/table-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SimpleTableComponent } from './components/simple-table/simple-table.component';

@NgModule({
  declarations: [AppComponent, SimpleTableComponent],
  imports: [BrowserModule, ReactiveFormsModule],
  providers: [TableDataService, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
