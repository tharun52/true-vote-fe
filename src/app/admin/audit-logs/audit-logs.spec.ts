import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditLogs } from './audit-logs';
import { AdminService } from '../admin.service';
import { of } from 'rxjs';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DatePipe } from '@angular/common';

describe('AuditLogs', () => {
  let component: AuditLogs;
  let fixture: ComponentFixture<AuditLogs>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  const mockResponse = {
    data: {
      data: {
        $values: [
          {
            description: 'Created a poll',
            entityId: 'poll-123',
            createdBy: 'admin@example.com',
            createdAt: '2024-01-01T10:00:00Z',
            updatedBy: 'admin@example.com',
            updatedAt: '2024-01-02T12:00:00Z'
          }
        ]
      },
      pagination: {
        totalRecords: 1,
        totalPages: 1
      }
    }
  };

  beforeEach(async () => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', ['getAuditLogs']);
    adminServiceSpy.getAuditLogs.and.returnValue(of(mockResponse));

    await TestBed.configureTestingModule({
      imports: [AuditLogs],
      providers: [
        { provide: AdminService, useValue: adminServiceSpy },
        DatePipe,
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditLogs);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch audit logs on init', () => {
    expect(adminServiceSpy.getAuditLogs).toHaveBeenCalledWith(1, 10);
    expect(component.logs.length).toBe(1);
    expect(component.logs[0].description).toBe('Created a poll');
    expect(component.totalPages).toBe(1);
    expect(component.totalRecords).toBe(1);
  });
});
