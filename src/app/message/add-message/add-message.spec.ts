import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMessage } from './add-message';

describe('AddMessage', () => {
  let component: AddMessage;
  let fixture: ComponentFixture<AddMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
