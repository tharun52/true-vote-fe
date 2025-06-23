import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterModerators } from './voter-moderators';

describe('VoterModerators', () => {
  let component: VoterModerators;
  let fixture: ComponentFixture<VoterModerators>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterModerators]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterModerators);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
