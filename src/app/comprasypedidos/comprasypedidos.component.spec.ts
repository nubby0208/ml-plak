import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasypedidosComponent } from './comprasypedidos.component';

describe('ComprasypedidosComponent', () => {
  let component: ComprasypedidosComponent;
  let fixture: ComponentFixture<ComprasypedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComprasypedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprasypedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
