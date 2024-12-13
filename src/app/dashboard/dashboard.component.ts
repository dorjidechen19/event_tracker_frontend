import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Event {
  time: string;
  title: string;
  description: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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

  events: Event[] = [
    {
      date: new Date(),
      time: '09:00 AM',
      title: 'Morning Meeting',
      description: 'Daily standup with the team'
    },
    {
      date: new Date(),
      time: '11:30 AM',
      title: 'Client Presentation',
      description: 'Project demo for the client'
    }
  ];

  ngOnInit() {
    this.selectedDate = new Date();
    this.generateCalendar();
    this.addNewEvent();
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
      this.isSameDay(event.date, this.selectedDate)
    );
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  addNewEvent() {
    const newEvent: Event = {
      date: new Date(this.selectedDate),
      time: '12:00 PM',
      title: 'New Event',
      description: 'Event description'
    };
    this.events.push(newEvent);
  }

  hasEvent(date: Date): boolean {
    return this.events.some(event => this.isSameDay(event.date, date));
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
}