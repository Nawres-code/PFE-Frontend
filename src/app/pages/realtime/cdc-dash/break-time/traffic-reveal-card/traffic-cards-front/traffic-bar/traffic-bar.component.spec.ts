import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficBarComponent } from './traffic-bar.component';

describe('TrafficBarComponent', () => {
  let component: TrafficBarComponent;
  let fixture: ComponentFixture<TrafficBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrafficBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
