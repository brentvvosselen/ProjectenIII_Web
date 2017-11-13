import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayShowComponent } from './day-show.component';

describe('DayShowComponent', () => {
  let component: DayShowComponent;
  let fixture: ComponentFixture<DayShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
