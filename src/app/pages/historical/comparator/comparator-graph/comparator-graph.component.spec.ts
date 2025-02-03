import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparatorGraphComponent } from './comparator-graph.component';

describe('ComparatorGraphComponent', () => {
  let component: ComparatorGraphComponent;
  let fixture: ComponentFixture<ComparatorGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparatorGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparatorGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
