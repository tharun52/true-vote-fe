import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { PollService } from '../poll.service';
import { start } from '@popperjs/core';
import { Router } from '@angular/router';
import { ToastService } from '../../shared/ToastService';
import { endDateValidator } from '../../auth/validators/end-date-validator';

@Component({
  selector: 'app-add-poll',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-poll.html',
  styleUrl: './add-poll.css'
})
export class AddPoll {
  pollForm: FormGroup;
  pollFile: File | null = null;
  responseMessage = '';

  constructor(private fb: FormBuilder, private pollService: PollService, private router:Router, private toastService:ToastService) {
    this.pollForm = new FormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl(),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', [Validators.required, endDateValidator]),
      optionTexts: new FormArray([
        new FormControl('', Validators.required),
        new FormControl('', Validators.required)
      ])
    });
  }

  public get title() {return this.pollForm.get('title');}
  public get startDate() {return this.pollForm.get('startDate');}
  public get endDate() {return this.pollForm.get('endDate');}
  // public get optionTextsForm() { return this.pollForm.get('optionTexts');}

  get optionTexts(): FormArray {
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
    const file = event.target.files[0];
    this.pollFile = file ?? null;
  }

  submit() {
    if (this.pollForm.invalid) {
      this.responseMessage = 'Please fill all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('Title', this.pollForm.get('title')?.value);
    formData.append('Description', this.pollForm.get('description')?.value || '');
    formData.append('StartDate', this.pollForm.get('startDate')?.value);
    formData.append('EndDate', this.pollForm.get('endDate')?.value);

    const options = this.optionTexts.value;
    for (let i = 0; i < options.length; i++) {
      formData.append(`OptionTexts`, options[i]);
    }

    if (this.pollFile) {
      formData.append('PollFile', this.pollFile);
    }

    this.pollService.addPoll(formData).subscribe({
      next: (res) => {
        this.responseMessage = 'Poll added successfully!';
        this.pollForm.reset();
        this.optionTexts.clear();
        this.addOption();
        this.addOption();
        this.toastService.show('Poll Created', 'Poll created successfully!', false);
        this.router.navigateByUrl('moderator/polls');
      },
      error: (err) => {
        this.responseMessage = 'Error: ' + (err?.error?.message ?? 'Something went wrong');
      },
    });
  }
}
