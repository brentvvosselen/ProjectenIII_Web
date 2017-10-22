import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteRegisterComponent } from './invite-register.component';

describe('InviteRegisterComponent', () => {
  let component: InviteRegisterComponent;
  let fixture: ComponentFixture<InviteRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
