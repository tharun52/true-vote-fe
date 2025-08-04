import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-audit-logs',
  imports: [DatePipe, ReactiveFormsModule, FormsModule],
  templateUrl: './audit-logs.html',
  styleUrl: './audit-logs.css'
})
export class AuditLogs implements OnInit {
  logs: any[] = [];
  error: string | null = null;

  page: number = 1;
  pageSize: number = 10;
  totalPages: number = 1;
  totalRecords: number = 0;
  
  loading: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchAuditLogs();
  }

  fetchAuditLogs() {
    this.adminService.getAuditLogs(this.page, this.pageSize).subscribe({
      next: (res) => {
        this.logs = res.data.data.$values;
        this.totalRecords = res.data.pagination.totalRecords;
        this.totalPages = res.data.pagination.totalPages;
        this.error = null;
      },
      error: (err) => {
        this.logs = [];
        this.error = 'Failed to load audit logs.';
      },
      complete: () => {
        this.loading = false;
      }
    });

  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchAuditLogs();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchAuditLogs();
    }
  }
}