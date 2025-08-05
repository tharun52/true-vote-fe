import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendMagicLink } from './send-magic-link';

describe('SendMagicLink', () => {
  let component: SendMagicLink;
  let fixture: ComponentFixture<SendMagicLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendMagicLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendMagicLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
