import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterPolls } from './voter-polls';

describe('VoterPolls', () => {
  let component: VoterPolls;
  let fixture: ComponentFixture<VoterPolls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterPolls]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterPolls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
