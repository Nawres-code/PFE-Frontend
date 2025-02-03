import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IoListComponent } from './io-list.component';

describe('IoListComponent', () => {
  let component: IoListComponent;
  let fixture: ComponentFixture<IoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IoListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
