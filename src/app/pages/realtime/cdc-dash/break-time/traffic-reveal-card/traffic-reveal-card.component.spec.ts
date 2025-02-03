import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficRevealCardComponent } from './traffic-reveal-card.component';

describe('TrafficRevealCardComponent', () => {
  let component: TrafficRevealCardComponent;
  let fixture: ComponentFixture<TrafficRevealCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficRevealCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficRevealCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
