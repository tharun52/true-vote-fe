import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdimHome } from './adim-home';

describe('AdimHome', () => {
  let component: AdimHome;
  let fixture: ComponentFixture<AdimHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdimHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdimHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
