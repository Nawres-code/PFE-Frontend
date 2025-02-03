import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealtimeFroidComponent } from './realtime-froid.component';

describe('RealtimeFroidComponent', () => {
  let component: RealtimeFroidComponent;
  let fixture: ComponentFixture<RealtimeFroidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealtimeFroidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealtimeFroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
