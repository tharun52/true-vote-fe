import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyMagicLink } from './verify-magic-link';

describe('VerifyMagicLink', () => {
  let component: VerifyMagicLink;
  let fixture: ComponentFixture<VerifyMagicLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyMagicLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyMagicLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
