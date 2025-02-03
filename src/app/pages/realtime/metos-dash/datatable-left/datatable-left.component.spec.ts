import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableLeftComponent } from './datatable-left.component';

describe('DatatableLeftComponent', () => {
  let component: DatatableLeftComponent;
  let fixture: ComponentFixture<DatatableLeftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatableLeftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableLeftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
