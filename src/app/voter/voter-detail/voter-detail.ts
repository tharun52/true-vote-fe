import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VoterModel } from '../../models/VoterModel';
import { VoterService } from '../voter.service';

@Component({
  selector: 'app-voter-detail',
  templateUrl: './voter-detail.html',
  styleUrl: './voter-detail.css',
  standalone: true
})
export class VoterDetail {
  @Input() email!: string;
  @Input() isModerator: boolean = false;
  @Output() close = new EventEmitter<void>();
  
  voter: VoterModel | null = null;

  constructor(private voterService: VoterService) {}

  ngOnInit(): void {
    if (this.email) {
      this.voterService.getVoterByEmail(this.email).subscribe(data => {
        this.voter = data;
      });
    }
  }

  deleteVoter(): void {
    if (this.voter && confirm('Are you sure you want to delete this voter?')) {
      console.log(this.voter.id);
    }
  }

  editVoter(): void {
    alert('Edit voter logic here...');
  }


  closePopup(): void {
    this.close.emit();
  }
}
