import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartPasswordComponent } from './restart-password.component';

describe('RestartPasswordComponent', () => {
  let component: RestartPasswordComponent;
  let fixture: ComponentFixture<RestartPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestartPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestartPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
