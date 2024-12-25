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
import { Event as CalendarEvent } from '../core/models/event.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AddEventDialogComponent,
    ReactiveFormsModule,
    ConfirmationDialogComponent
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
    private router: Router
  ) {}
  
  events: CalendarEvent[] = [];

 

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

  getEventsForSelectedDate(): CalendarEvent[] {
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

    dialogRef.closed.subscribe({
      next: (result: unknown) => {
        const event = result as CalendarEvent;  // Type assertion to CalendarEvent
        if (event) {
          this.eventService.createEvent(event).subscribe({
            next: (response) => {
              // Add the new event to the events list
              this.events.push(event);
  
              // Optionally: Update the events for the selected date to reflect the new event
              // this.toastr.success('Event added successfully!', 'Success');
            },
            error: (error) => {
              this.dialog.open(ConfirmationDialogComponent, {
                data: {
                  title: 'Error',
                  message: error.message || 'Failed to create event. Please try again.'
                }
              });
            }
          });
        }
      },
      error: (error) => {
        this.toastr.error('Error processing the event', 'Error');
      }
    });
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




  
}