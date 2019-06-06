import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDocumentComponent } from './rate-document.component';

describe('RateDocumentComponent', () => {
  let component: RateDocumentComponent;
  let fixture: ComponentFixture<RateDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
