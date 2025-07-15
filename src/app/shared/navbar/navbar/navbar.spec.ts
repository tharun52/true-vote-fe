import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Navbar } from './navbar';
import { AuthService } from '../../../auth/auth.service';
import { ThemeService } from '../../ThemeService';
import { MessageService } from '../../../message/message.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  let mockAuthService: any;
  let mockThemeService: any;
  let mockMessageService: any;

  beforeEach(async () => {
    mockAuthService = {
      getRole: jasmine.createSpy('getRole').and.returnValue('admin'),
      getUsername: jasmine.createSpy('getUsername').and.returnValue('TestUser'),
      logout: jasmine.createSpy('logout'),
      isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true)
    };

    mockThemeService = {
      toggleTheme: jasmine.createSpy('toggleTheme')
    };

    mockMessageService = {
      getMessages: jasmine.createSpy('getMessages').and.returnValue(of([{ id: 1, text: 'Hello' }]))
    };

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: MessageService, useValue: mockMessageService },
        { provide: ActivatedRoute, useValue: {} }, 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set hasMessages to true if messages are returned', () => {
    expect(component.hasMessages).toBeTrue();
    expect(mockMessageService.getMessages).toHaveBeenCalled();
  });

  it('should return the correct userName', () => {
    expect(component.userName).toBe('TestUser');
  });

  it('should call logout from authService', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should toggle theme using themeService', () => {
    component.toggleTheme();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('should toggle menu open and close', () => {
    expect(component.isMenuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should close the menu when closeMenu() is called', () => {
    component.isMenuOpen = true;
    component.closeMenu();
    expect(component.isMenuOpen).toBeFalse();
  });

  it('should open voter popup with selected email', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');
    component.openVoterDetail('voter@test.com', event);
    expect(component.selectedEmail).toBe('voter@test.com');
    expect(component.showPopup).toBeTrue();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should open moderator popup with selected email', () => {
    const event = new MouseEvent('click');
    spyOn(event, 'preventDefault');
    component.openModeratorDetail('mod@test.com', event);
    expect(component.selectedModeratorEmail).toBe('mod@test.com');
    expect(component.showModeratorPopup).toBeTrue();
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
