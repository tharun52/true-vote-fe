import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterMessage } from './voter-message';

describe('VoterMessage', () => {
  let component: VoterMessage;
  let fixture: ComponentFixture<VoterMessage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterMessage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterMessage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
