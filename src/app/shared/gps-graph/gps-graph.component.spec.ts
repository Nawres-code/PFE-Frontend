import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GpsGraphComponent } from './gps-graph.component';

describe('GpsGraphComponent', () => {
  let component: GpsGraphComponent;
  let fixture: ComponentFixture<GpsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GpsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GpsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
