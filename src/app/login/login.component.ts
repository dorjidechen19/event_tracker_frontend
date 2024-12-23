import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LoginModel } from '../models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Fixed typo here from styleUrl to styleUrls
  standalone: true,
  imports: [RouterLink, RouterModule, ReactiveFormsModule, CommonModule, ToastrModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]]
    });
  }

  ngOnInit(): void {
    // Clear any existing auth data on login page load
    localStorage.clear();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData: LoginModel = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    console.log('Sending login data:', loginData); // Debug log

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login success:', response); // Debug log
        this.toastr.success('Login successful', 'Success');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login error:', error); // Debug log
        const errorMessage = error.error?.message || 'Login failed';
        this.toastr.error(errorMessage, 'Error');
      }
    });
  }

  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }
}
