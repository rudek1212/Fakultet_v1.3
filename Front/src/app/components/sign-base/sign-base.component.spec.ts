import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignBaseComponent } from './sign-base.component';

describe('SignBaseComponent', () => {
  let component: SignBaseComponent;
  let fixture: ComponentFixture<SignBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
