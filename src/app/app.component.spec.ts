import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';

@Component({
  selector: 'app-simple-table',
  template: ''
})
class SimpleTableComponentMock {}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, SimpleTableComponentMock],
    }).compileComponents();
  }));

  it('should create the component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.debugElement.componentInstance;
    expect(component).toBeTruthy();
  });

  it(`should have as title 'Angular Task'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.whenStable().then(() => {
      const component = fixture.componentInstance;
      expect(component.titleText).toEqual('Angular Task');
    });
    fixture.detectChanges();
  }));

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Angular Task');
  });
});
