import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterHome } from './voter-home';

describe('VoterHome', () => {
  let component: VoterHome;
  let fixture: ComponentFixture<VoterHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoterHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
