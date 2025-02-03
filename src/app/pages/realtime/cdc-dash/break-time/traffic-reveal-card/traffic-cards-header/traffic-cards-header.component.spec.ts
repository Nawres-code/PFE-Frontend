import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficCardsHeaderComponent } from './traffic-cards-header.component';

describe('TrafficCardsHeaderComponent', () => {
  let component: TrafficCardsHeaderComponent;
  let fixture: ComponentFixture<TrafficCardsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficCardsHeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficCardsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
