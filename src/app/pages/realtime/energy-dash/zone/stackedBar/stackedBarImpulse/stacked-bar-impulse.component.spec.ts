import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StackedBarImpulseComponent } from './stacked-bar-impulse.component';


describe('StackedBarImpulseComponent', () => {
  let component: StackedBarImpulseComponent;
  let fixture: ComponentFixture<StackedBarImpulseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StackedBarImpulseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StackedBarImpulseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
