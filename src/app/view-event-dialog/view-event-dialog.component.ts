import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '@core/services/event.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-event-dialog',
  standalone: true,
  imports: [MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatDialogModule,
    SweetAlert2Module
  ],
  templateUrl: './view-event-dialog.component.html',
  styleUrls: ['./view-event-dialog.component.css']
})
export class ViewEventDialogComponent {
  error: string | null = null;
  
  constructor(
     private toastr: ToastrService,
    public dialogRef: MatDialogRef<ViewEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: any },
    private eventService: EventService, 
  ) {
    if (data.event.eventDate instanceof Date) {
      data.event.eventDate = data.event.eventDate.toISOString().split('T')[0];
    } else if (typeof data.event.eventDate === 'string') {
      // Ensure the date string is in the correct format
      const date = new Date(data.event.eventDate);
      data.event.eventDate = date.toISOString().split('T')[0];
      console.log(data.event.eventDate) 
    }
  }

  private fetchEvents(): void {
    this.error = null;
  }

  deleteEvent(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(this.data.event.id).subscribe({
          next: () => {
            this.eventService.deleteEvent(this.data.event); // Call the deleteEvent method from DashboardComponent
            this.dialogRef.close(null); // Close the dialog after deletion
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Failed to delete event';
            this.toastr.error(errorMessage, 'Error');
          }
        });
        // Perform delete action
        console.log('Event deleted:', this.data.event);
        this.dialogRef.close('deleted'); // Optionally close the parent dialog
        Swal.fire('Deleted!', 'Your event has been deleted.', 'success');
      }
    });
  }


  saveEvent() {
    this.eventService.updateEvent(this.data.event.id, this.data.event).subscribe({
      next: () => {
        this.toastr.success('Event updated successfully');
        this.dialogRef.close(this.data.event);
      },
      error: (error) => {
        this.toastr.error(error.error?.message || 'Failed to update event');
      }
    });
  }
  
  onClose(): void {
    this.dialogRef.close();
  }
}
