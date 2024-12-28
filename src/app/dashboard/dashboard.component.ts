import { Component, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EventService } from '../core/services/event.service';
import { Event as Event } from '../core/models/event.model';
import { ViewEventDialogComponent } from 'app/view-event-dialog/view-event-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  isSidebarClosed = false;
  isRightPanelClosed = false;
  selectedDate: Date = new Date();
  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  dates: Date[] = [];
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


  constructor(
    private dialog: Dialog,
    private elementRef: ElementRef,
    private authService: AuthService,
    private eventService: EventService,
    private toastr: ToastrService,
    private router: Router,
    private modal: MatDialog
  ) {}
  
  events: Event[] = [];

 

  ngOnInit() {
    // Check authentication on dashboard load
    this.authService.validateToken().subscribe(isValid => {
      if (!isValid) {
        this.router.navigate(['/login']);
      } else {
        this.selectedDate = new Date();
        this.generateCalendar();
        this.eventService.fetchEvents().subscribe({
          next: (response) => {
            this.events = response.data.events.map((event: any) => ({
              id: event.id,
              title: event.title,
              description: event.description,
              eventDate: event.eventDate, // Can handle transformation here if needed
            }));
          },
          error: (error) => {
            this.dialog.open(ConfirmationDialogComponent, {
              data: {
                title: 'Error',
                message: error.message || 'Error fetching events. Please try again.'
              }
            });
          }
        });
      }
    });
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    this.dates = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      this.dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  toggleSidebar() {
    this.isSidebarClosed = !this.isSidebarClosed;
  }

  toggleRightPanel() {
    this.isRightPanelClosed = !this.isRightPanelClosed;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
    this.generateCalendar();
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
    this.generateCalendar();
  }

  prevYear() {
    this.currentYear--;
    this.generateCalendar();
  }

  nextYear() {
    this.currentYear++;
    this.generateCalendar();
  }

  selectMonth(monthIndex: number) {
    this.currentMonth = monthIndex;
    this.generateCalendar();
  }

  getEventsForSelectedDate(): Event[] {
    return this.events.filter(event => 
      this.isSameDay(new Date(event.eventDate), this.selectedDate)
    );
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  //add new event
  addNewEvent() {
    const dialogRef = this.dialog.open(AddEventDialogComponent, {
      width: '400px',
      data: { date: this.selectedDate }
    });
  }

  isPastDate(date: Date): boolean {
    const today = new Date();
    // Set today's time to 00:00:00 for an accurate comparison
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    
    return selectedDate < today;
  }

  hasEvent(date: Date): boolean {
    return this.events.some(event => 
      this.isSameDay(new Date(event.eventDate), date)
    );
  }

  selectDate(date: Date) {
    this.selectedDate = new Date(date);
    if (this.isRightPanelClosed) {
      this.isRightPanelClosed = false;
    }
  }

  get monthName(): string {
    return this.months[this.currentMonth];
  }

  isSameMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return this.isSameDay(date, today);
  }

  isSelected(date: Date): boolean {
    return this.isSameDay(date, this.selectedDate);
  }

  formatSelectedDate(): string {
    return this.selectedDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?'
      }
    });

    dialogRef.closed.subscribe(result => {
      if (result) {
        this.authService.logout();
        this.toastr.success('Logout successful', 'Success');
        this.router.navigate(['/login']);
      }
    });
  }

  openViewEventDialog(event: Event) {
    const dialogRef = this.modal.open(ViewEventDialogComponent, {
      width: '400px',
      data: { event }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed');
    });
  }

  deleteEvent(event: Event) {
    if (event.id !== undefined) {  // Check if the id is defined
      const confirmation = confirm('Are you sure you want to delete this event?');
      if (confirmation) {
        this.eventService.deleteEvent(event.id).subscribe({
          next: () => {
            // Remove the event from the events array
            this.events = this.events.filter(e => e.id !== event.id);
            this.toastr.success('Event deleted successfully', 'Success');
            
            // Optionally close the dialog after deletion
            this.modal.closeAll();
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Failed to delete event';
            this.toastr.error(errorMessage, 'Error');
          }
        });
      }
    } else {
      this.toastr.error('Invalid event ID', 'Error');
    }
  }
  
} 
 