import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildAddFormComponent } from './child-add-form.component';

describe('ChildAddFormComponent', () => {
  let component: ChildAddFormComponent;
  let fixture: ComponentFixture<ChildAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
