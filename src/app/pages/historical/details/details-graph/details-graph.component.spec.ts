import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsGraphComponent } from './details-graph.component';

describe('DetailsGraphComponent', () => {
  let component: DetailsGraphComponent;
  let fixture: ComponentFixture<DetailsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
