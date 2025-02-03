import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficCardsFrontComponent } from './traffic-cards-front.component';

describe('TrafficCardsFrontComponent', () => {
  let component: TrafficCardsFrontComponent;
  let fixture: ComponentFixture<TrafficCardsFrontComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficCardsFrontComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficCardsFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
