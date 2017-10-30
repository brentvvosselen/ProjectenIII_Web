import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildEditComponent } from './child-edit.component';

describe('ChildEditComponent', () => {
  let component: ChildEditComponent;
  let fixture: ComponentFixture<ChildEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
