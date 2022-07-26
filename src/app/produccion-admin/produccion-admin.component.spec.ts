import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionAdminComponent } from './produccion-admin.component';

describe('ProduccionAdminComponent', () => {
  let component: ProduccionAdminComponent;
  let fixture: ComponentFixture<ProduccionAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduccionAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
