import { Component, Input } from '@angular/core';
import { ModeratorModel, ModeratorQueryDto } from '../../models/ModeratorModel';
import { Subject, debounceTime } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { ModeratorService } from '../moderator.service';
import { ModeratorDetail } from '../moderator-detail/moderator-detail';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-moderators-list',
  imports: [FormsModule, NgClass, ModeratorDetail],
  templateUrl: './moderators-list.html',
  styleUrl: './moderators-list.css'
})
export class ModeratorsList {
  @Input() isDeleted: boolean = false;
  
  moderators: ModeratorModel[] = [];
  error: string | null = null;

  searchTerm: string = '';
  sortBy: string = '';
  sortDesc: boolean = false;
  page: number = 1;
  pageSize: number = 3;
  totalPages: number = 1;

  selectedModeratorEmail: string | null = null;
  showModeratorPopup = false;

  private searchSubject = new Subject<void>();

  constructor(private moderatorService: ModeratorService, private authService:AuthService) {}

  ngOnInit() {
    this.searchSubject.pipe(debounceTime(400)).subscribe(() => {
      this.page = 1;
      this.fetchModerators();
    });

    this.fetchModerators();
  }

  onSearchChange() {
    this.searchSubject.next();
  }

  toggleSortDirection() {
    this.sortDesc = !this.sortDesc;
    this.fetchModerators();
  }

  fetchModerators() {
    const query = new ModeratorQueryDto(
      this.searchTerm,
      this.sortBy,
      this.sortDesc,
      this.page,
      this.pageSize,
      this.isDeleted 
    );

    this.moderatorService.getModerators(query).subscribe({
      next: (response) => {
        this.moderators = response.data;
        this.totalPages = response.pagination.totalPages;
        this.error = null;
      },
      error: () => {
        this.error = 'Failed to load moderators.';
        this.moderators = [];
      }
    });
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchModerators();
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchModerators();
    }
  }

  trackByFn(index: number, item: ModeratorModel) {
    return item.id;
  }

  openModeratorDetail(email: string): void {
    this.selectedModeratorEmail = email;
    this.showModeratorPopup = true;
  }
  isAdmin(){
    return this.authService.getRole() == 'Admin';
  }
  onModeratorDetailClosed(): void {
    this.showModeratorPopup = false;
    this.fetchModerators(); 
  }
}
