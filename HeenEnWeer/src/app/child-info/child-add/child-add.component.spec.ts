import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildAddComponent } from './child-add.component';

describe('ChildAddComponent', () => {
  let component: ChildAddComponent;
  let fixture: ComponentFixture<ChildAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChildAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
