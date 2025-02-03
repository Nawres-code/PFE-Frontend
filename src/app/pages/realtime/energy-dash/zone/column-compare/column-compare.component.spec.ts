import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnCompareComponent } from './column-compare.component';

describe('ColumnCompareComponent', () => {
  let component: ColumnCompareComponent;
  let fixture: ComponentFixture<ColumnCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColumnCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
