import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignupService } from '../services/signup.service';
import { SignupModel } from '../models/signup.model';
import {ToastrModule, ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
    ToastrModule
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private signupService: SignupService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.signupForm = this.formBuilder.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
      ]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    const signupData: SignupModel = {
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.signupService.signup(signupData).subscribe({
      next: (data) => {
        this.toastr.success('Signup successful', 'Success');
        this.router.navigate(['/login']);
      },
      error: (data) => {
        this.toastr.error(data.error?.message || 'Signup failed', 'Error');
      }
    });
  }

  // Getter for easy access to form fields
  get f() { return this.signupForm.controls; }

}
