export interface Event {
  id?: number;
  title: string;
  description: string;
  eventDate: string;
}

export interface EventResponse {
  status: string;
  message: string;
  data: Event;
}

export interface EventsResponse {
  status: string;
  message: string;
  data: Event[];
} 
