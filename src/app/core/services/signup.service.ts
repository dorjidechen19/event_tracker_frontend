
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SignupModel } from '../models/signup.model';
import { ApiService } from '../../api.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SignupService {


  constructor(private apiService: ApiService) {}

  signup(signupData: SignupModel): Observable<any> {
    return this.apiService.post('/auth/sign-up', signupData);
  }
}