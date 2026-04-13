import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup;

  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  submit() {
  if (this.form.invalid) { this.form.markAllAsTouched(); return; }
  this.loading = true;
  const { email, password } = this.form.value;

  this.auth.login(email!, password!).subscribe({  // email works since backend accepts email OR username
    next: (res: any) => {
      this.auth.setToken(res.data.login.token);
      this.router.navigate(['/employees']);
    },
    error: (err: any) => {
      this.snack.open(err.message, 'Close', { duration: 4000 });
      this.loading = false;
    }
  });
}
}
