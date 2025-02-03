import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetosDashComponent } from './metos-dash.component';

describe('MetosDashComponent', () => {
  let component: MetosDashComponent;
  let fixture: ComponentFixture<MetosDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetosDashComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetosDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
