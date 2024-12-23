import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { HttpResponse, HttpHeaders } from '@angular/common/http';
import { Event, EventResponse } from '../models/event.model';
import { ApiService } from '../../api.service';
import { Dialog } from '@angular/cdk/dialog';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private apiService: ApiService,
    private dialog: Dialog,
    private toastr: ToastrService
  ) {}

  createEvent(event: Event): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    return this.apiService.post<any>('/events', event);
  }

  fetchEvents():Observable<any>{
    return  this.apiService.get<any>("/events");

  }

  deleteEvent(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.apiService.delete<any>(`/events/${id}`, { headers });
  }

  getEventById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.apiService.get<any>(`/events/${id}`, { headers });
  }
} 