import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/services/auth.service';
import { LoginModel } from '../core/models/login.model';

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
    // Check if already authenticated
    if(this.authService.getToken()) {
      this.authService.validateToken().subscribe(isValid => {
        if (isValid) {
          this.router.navigate(['/dashboard']);
        }
      })
    }
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
        this.authService.setToken(response?.accessToken);
        if (response.refreshToken) {
          this.authService.setRefreshToken(response.refreshToken);
        }

        this.toastr.success('Login successful', 'Success');
        this.router.navigate(['/dashboard']);
      },
      error: (data) => {
        this.toastr.error(data.error?.message || 'Login failed', 'Error');
      }
    });
  }



  // Getter for easy access to form fields
  get f() { return this.loginForm.controls; }
}
