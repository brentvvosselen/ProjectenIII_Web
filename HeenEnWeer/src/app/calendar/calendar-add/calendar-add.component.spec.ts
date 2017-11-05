import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAddComponent } from './calendar-add.component';

describe('CalendarAddComponent', () => {
  let component: CalendarAddComponent;
  let fixture: ComponentFixture<CalendarAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
