/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ChmodComponent } from './chmod.component';

describe('ChmodComponent', () => {
  let component: ChmodComponent;
  let fixture: ComponentFixture<ChmodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChmodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChmodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
