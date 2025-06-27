import { Component, Input, OnInit } from '@angular/core';
import { PollQueryDto, PollResponseItemModel} from '../../models/PollModels';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime} from 'rxjs';
import { PollService } from '../poll.service';
import { PollCard } from "../poll-card/poll-card";

@Component({
  selector: 'app-polls-list',
  imports: [PollCard, FormsModule, ReactiveFormsModule],
  templateUrl: './polls-list.html',
  styleUrl: './polls-list.css'
})
export class PollsList implements OnInit {
  @Input() createdByEmail: string | null = '';

  polls: PollResponseItemModel[] = [];
  searchControl = new FormControl('');
  sortBy = '';
  sortDesc = false;
  startDateFrom = '';
  startDateTo = '';
  page = 1;
  pageSize = 10;
  totalPages: number = 1;

  loading: boolean = true;
  errorMessage: string | null = null;

  constructor(private pollService: PollService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400))
      .subscribe(() => {
        this.page = 1;
        this.loadPolls();
      });

    this.loadPolls();
  }

  loadPolls(): void {
    const query: PollQueryDto = {
      searchTerm: this.searchControl.value || '',
      sortBy: this.sortBy,
      sortDesc: this.sortDesc,
      startDateFrom: this.startDateFrom || undefined,
      startDateTo: this.startDateTo || undefined,
      page: this.page,
      pageSize: this.pageSize,
      createdByEmail: this.createdByEmail || undefined
    };

    this.errorMessage = null;
    this.loading = true;

    this.pollService.getPolls(query).subscribe({
      next: response => {
        this.polls = response.data;
        this.totalPages = response.pagination.totalPages;
        this.loading = false;
      },
      error: err => {
        console.error('Error loading polls:', err);
        this.errorMessage = 'Failed to load polls. Please try again.';
        this.loading = false;
      }
    });
  }

  changePage(offset: number): void {
    this.page += offset;
    this.loadPolls();
  }

  resetFilters(): void {
    this.sortBy = '';
    this.sortDesc = false;
    this.startDateFrom = '';
    this.startDateTo = '';
    this.page = 1;
    this.searchControl.setValue('');
    this.loadPolls();
  }
  
  downloadFile(event: Event, fileId:string): void {
    event.preventDefault();

    const link = document.createElement('a');
    link.href = this.pollService.getPollFileUrl(fileId);
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

}