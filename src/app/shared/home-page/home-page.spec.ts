import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home-page';
import { AuthService } from '../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getRole', 'isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: {} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to role page if logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('Voter');

    component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/voter']);
  });

  it('should not redirect if not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);

    component.ngOnInit();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
