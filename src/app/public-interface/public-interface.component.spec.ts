import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicInterfaceComponent } from './public-interface.component';

describe('PublicInterfaceComponent', () => {
  let component: PublicInterfaceComponent;
  let fixture: ComponentFixture<PublicInterfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicInterfaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicInterfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
