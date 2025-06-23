import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterDetail } from './voter-detail';

describe('VoterDetail', () => {
  let component: VoterDetail;
  let fixture: ComponentFixture<VoterDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
