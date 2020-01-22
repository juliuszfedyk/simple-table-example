import { element } from 'protractor';
import { TableDataServiceMock, largeDataSet } from './../../services/table-data.service.mock';
import { TableDataService } from './../../services/table-data.service';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

const getElements = (
  query: string,
  fixture: ComponentFixture<SimpleTableComponent>
): HTMLElement[] => {
  return fixture.nativeElement.querySelectorAll(query);
};

import { SimpleTableComponent } from './simple-table.component';

describe('SimpleTableComponent', () => {
  let component: SimpleTableComponent;
  let fixture: ComponentFixture<SimpleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SimpleTableComponent],
      imports: [ReactiveFormsModule],
      providers: [
        DatePipe,
        { provide: TableDataService, useClass: TableDataServiceMock },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('OnInit', () => {
    it('should populate table with all of the items', async(() => {
      fixture.whenStable().then(() => {
        expect(component.filteredItems.length).toBe(
          (component as any).items.length
        );
      });
      fixture.detectChanges();
    }));
    it('should sort the table by id', async(() => {
      fixture.whenStable().then(() => {
        expect(component.filteredItems[1].id).toBeGreaterThan(
          component.filteredItems[0].id
        );
      });
      fixture.detectChanges();
    }));
  });
  describe('Sorting', () => {
    beforeEach(async(() => {
      fixture.detectChanges();
    }));
    it('a click on the column header should sort the table by the prop in the header', async(() => {
      fixture.whenStable().then(() => {
        const elements: HTMLElement[] = getElements(
          '.table-value-name',
          fixture
        );
        expect(elements[0].innerText).toEqual('AAA');
      });
      fixture.nativeElement.querySelector('.table-column-header-name').click();
      fixture.detectChanges();
    }));
  });
  describe('Filtering', () => {
    beforeEach(async(() => {
      fixture.detectChanges();
    }));
    it('should show only rows that have "type 2" in description when searching for "type 2"', async(() => {
      fixture.whenStable().then(() => {
        const rows = getElements('.table-value-description', fixture);
        expect(rows.length).toBe(2);
        expect(rows[0].innerText).toContain('type 2');
        expect(rows[1].innerText).toContain('type 2');
      });
      component.applyFilter('type 2');
      fixture.detectChanges();
    }));
  });
  describe('Pagination', () => {
    it('should show correct number of pages when the number of rows is higher than 20', async(() => {
      const service = fixture.debugElement.injector.get(TableDataService);
      service.items = largeDataSet;
      fixture.whenStable().then(() => {
        const elements = getElements('.page-link', fixture);
        // 2 page-items are "previous" and "next"
        expect(elements.length).toBe(4);
      });
      fixture.detectChanges();
    }));
    it('should show only one page whenwhen the number of rows is lower than 20', async(() => {
      fixture.whenStable().then(() => {
        const elements = getElements('.page-link', fixture);
        expect(elements.length).toBe(3);
      });
      fixture.detectChanges();
    }));
  });
});
