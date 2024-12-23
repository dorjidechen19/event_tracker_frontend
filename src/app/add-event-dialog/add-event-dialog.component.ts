import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {EventService} from '../services/event.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.css']
})
export class AddEventDialogComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<any>,
    private eventService: EventService,
    @Inject(DIALOG_DATA) public data: { date: Date },
    private toastr: ToastrService,
    private router: Router,
  ) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      eventDate: [data.date.toISOString().split('T')[0], Validators.required]
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {

      const isoDate = new Date(this.eventForm.value.eventDate);
      console.log(isoDate.toISOString().split('T')[0]);

      const event = {
        title: this.eventForm.value.title,
        description: this.eventForm.value.description,
        eventDate: isoDate.toISOString().split('T')[0]
      };

      this.eventService.createEvent(event).subscribe({
        next: (response) => {
          this.toastr.success('Event Added successfully', 'Success');
          this.dialogRef.close();
        },
        error: (error) => {
          const errorMessage = error.error?.message || 'Event Add Failed';
          this.toastr.error(errorMessage, 'Error');
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
