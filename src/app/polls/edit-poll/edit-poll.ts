import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-edit-poll',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './edit-poll.html',
  styleUrl: './edit-poll.css'
})
export class EditPoll {
  @Input() poll: any;
  @Output() updated = new EventEmitter<any>();

  pollForm!: FormGroup;
  responseMessage = '';
  file: File | null = null;

  constructor(private fb: FormBuilder, private pollService: PollService) {}

  ngOnInit(): void {
    this.pollForm = this.fb.group({
      title: [this.poll?.title, Validators.required],
      description: [this.poll?.description],
      startDate: [this.poll?.startDate, Validators.required],
      endDate: [this.poll?.endDate, Validators.required],
      optionTexts: this.fb.array([]),
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
    this.optionTexts.push(new FormControl('', Validators.required));
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
      },
      error: (err) => {
        this.responseMessage =
          err?.error?.message || '❌ Failed to update poll.';
      },
    });
  }
}
