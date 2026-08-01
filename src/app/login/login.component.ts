import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage = '';
  loading = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  logIn(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.success) {
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = result.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }
}
