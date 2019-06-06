import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalDocumentComponent } from './external-document.component';

describe('ExternalDocumentComponent', () => {
  let component: ExternalDocumentComponent;
  let fixture: ComponentFixture<ExternalDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
