import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModeratorDetail } from './moderator-detail';
import { ModeratorService } from '../moderator.service';
import { AuthService } from '../../auth/auth.service';
import { of, throwError } from 'rxjs';
import { ModeratorModel } from '../../models/ModeratorModel';
import { EventEmitter } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ModeratorDetail', () => {
  let component: ModeratorDetail;
  let fixture: ComponentFixture<ModeratorDetail>;
  let moderatorServiceSpy: jasmine.SpyObj<ModeratorService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockModerator: ModeratorModel = {
    id: 'mod123',
    name: 'Alice Moderator',
    email: 'alice@example.com',
    isDeleted: false
  };

  beforeEach(async () => {
    moderatorServiceSpy = jasmine.createSpyObj('ModeratorService', [
      'getModeratorByEmail',
      'updateAsAdmin',
      'updateAsModerator',
      'deleteModerator'
    ]);

    authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    authServiceSpy.getCurrentUser.and.returnValue({
      userId: 'u123',
      username: 'admin@example.com',
      role: 'Admin',
      token: 'fake-token',
      refreshToken: 'fake-refresh-token'
    });

    await TestBed.configureTestingModule({
      imports: [ModeratorDetail],
      providers: [
        { provide: ModeratorService, useValue: moderatorServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ModeratorDetail);
    component = fixture.componentInstance;
    component.email = 'alice@example.com';
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch moderator data and init form on ngOnInit', () => {
    moderatorServiceSpy.getModeratorByEmail.and.returnValue(of(mockModerator));
    component.ngOnInit();

    expect(moderatorServiceSpy.getModeratorByEmail).toHaveBeenCalledWith('alice@example.com');
    expect(component.moderator).toEqual(mockModerator);
    expect(component.editForm).toBeTruthy();
  });

  it('should delete moderator after confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    moderatorServiceSpy.getModeratorByEmail.and.returnValue(of(mockModerator));
    moderatorServiceSpy.deleteModerator.and.returnValue(of({}));

    component.ngOnInit();
    fixture.detectChanges();
    component.deleteAccount();

    expect(moderatorServiceSpy.deleteModerator).toHaveBeenCalledWith('mod123');
  });

  it('should NOT delete moderator if confirmation is cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    moderatorServiceSpy.getModeratorByEmail.and.returnValue(of(mockModerator));

    component.ngOnInit();
    fixture.detectChanges();
    component.deleteAccount();

    expect(moderatorServiceSpy.deleteModerator).not.toHaveBeenCalled();
  });

  it('should re-add a deleted moderator', () => {
    const deletedModerator = { ...mockModerator, isDeleted: true };
    moderatorServiceSpy.getModeratorByEmail.and.returnValue(of(deletedModerator));
    moderatorServiceSpy.updateAsAdmin.and.returnValue(of({}));

    component.ngOnInit();
    fixture.detectChanges();
    component.reAddModerator();

    expect(moderatorServiceSpy.updateAsAdmin).toHaveBeenCalledWith('mod123', {
      name: 'Alice Moderator',
      email: 'alice@example.com',
      isDeleted: false
    });
  });

  it('should emit close event when closePopup is called', () => {
    spyOn(component.close, 'emit');
    component.closePopup();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should submit edit with password as moderator', () => {
    component.isModerator = true;
    component.moderator = mockModerator;
    const data = { name: 'New Name' };

    moderatorServiceSpy.updateAsModerator.and.returnValue(of({}));
    component.submitEditWithPassword(data);
    expect(moderatorServiceSpy.updateAsModerator).toHaveBeenCalledWith(data);
  });

  it('should not call update if moderator is null', () => {
    component.moderator = null;
    const data = { name: 'Should Not Call' };

    component.submitEdit(data);
    expect(moderatorServiceSpy.updateAsAdmin).not.toHaveBeenCalled();
  });
});
