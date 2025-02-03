import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyGraphComponent } from './energy-graph.component';

describe('EnergyGraphComponent', () => {
  let component: EnergyGraphComponent;
  let fixture: ComponentFixture<EnergyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnergyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnergyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
