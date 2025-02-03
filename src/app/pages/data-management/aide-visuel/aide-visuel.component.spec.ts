import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AideVisuelComponent } from './aide-visuel.component';

describe('AideVisuelComponent', () => {
  let component: AideVisuelComponent;
  let fixture: ComponentFixture<AideVisuelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AideVisuelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AideVisuelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
