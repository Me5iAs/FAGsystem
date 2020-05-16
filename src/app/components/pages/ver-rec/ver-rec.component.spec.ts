import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRecComponent } from './ver-rec.component';

describe('VerRecComponent', () => {
  let component: VerRecComponent;
  let fixture: ComponentFixture<VerRecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerRecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerRecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
