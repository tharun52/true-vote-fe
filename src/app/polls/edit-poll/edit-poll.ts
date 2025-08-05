import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PollService } from '../poll.service';
import { endDateValidator } from '../../auth/validators/end-date-validator';
import { ToastService } from '../../shared/ToastService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-poll',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-poll.html',
  styleUrl: './edit-poll.css',
  standalone: true
})
export class EditPoll {
  @Input() poll: any;
  @Output() updated = new EventEmitter<any>();

  pollForm!: FormGroup;
  responseMessage = '';
  file: File | null = null;
  loading = false;
  deleteLoading = false;


  public get title() { return this.pollForm.get('title'); }
  public get startDate() { return this.pollForm.get('startDate'); }
  public get endDate() { return this.pollForm.get('endDate'); }

  constructor(private fb: FormBuilder, private pollService: PollService, private toastService: ToastService, private router: Router) { }

  ngOnInit(): void {
    const startDate = this.formatDate(this.poll.startDate);
    const endDate = this.formatDate(this.poll.endDate);
    console.log(this.poll.startDate);
    console.log(this.poll.endDate);
    this.pollForm = new FormGroup({
      title: new FormControl(this.poll.title, Validators.required),
      description: new FormControl(this.poll.description),
      startDate: new FormControl(startDate, Validators.required),
      endDate: new FormControl(endDate, [Validators.required, endDateValidator]),
      optionTexts: new FormArray([])
    });

    const optionsArray = this.pollForm.get('optionTexts') as FormArray;
    this.poll?.pollOptions?.$values.forEach((opt: any) =>
      optionsArray.push(new FormControl(opt.optionText, Validators.required))
    );
  }

  get optionTexts() {
    return this.pollForm.get('optionTexts') as FormArray;
  }

  addOption() {
    this.optionTexts.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number) {
    if (this.optionTexts.length > 2) {
      this.optionTexts.removeAt(index);
    }
  }

  onFileChange(event: any) {
    this.file = event.target.files[0];
  }

  submit() {
    if (this.pollForm.invalid) {
      this.pollForm.markAllAsTouched();
      return;
    }

    this.loading = true; 

    const formData = new FormData();
    const formValue = this.pollForm.value;

    formData.append('Title', formValue.title);
    formData.append('Description', formValue.description || '');
    formData.append('StartDate', formValue.startDate);
    formData.append('EndDate', formValue.endDate);

    formValue.optionTexts.forEach((opt: string) =>
      formData.append('OptionTexts', opt)
    );

    if (this.file) {
      formData.append('PollFile', this.file);
    }

    this.pollService.updatePoll(this.poll.id, formData).subscribe({
      next: (res: any) => {
        this.responseMessage = '✅ Poll updated successfully!';
        this.updated.emit(res.data);
        this.toastService.show("Update Successs", "Your details have been updated successfully", false);
      },
      error: (err) => {
        this.responseMessage = err?.error?.message || '❌ Failed to update poll.';
      },
      complete: () => {
        this.loading = false; 
      }
    });
  }


  private formatDate(date: string | Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  deletePoll() {
    const confirmation = prompt(
      'To confirm deletion, please type DELETE (in uppercase):'
    );

    if (confirmation !== 'DELETE') {
      return;
    }

    this.deleteLoading = true;

    this.pollService.deletePoll(this.poll.id).subscribe({
      next: () => {
        this.toastService.show('Poll Deleted', 'The poll was successfully deleted.', false);
        this.updated.emit(null);
        window.location.reload();
      },
      error: (err) => {
        this.responseMessage = err?.error?.message || '❌ Failed to delete poll.';
        this.deleteLoading = false;
      },
      complete: () => {
        this.deleteLoading = false;
      }
    });
  }
}
