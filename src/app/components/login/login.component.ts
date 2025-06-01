import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  showRegisterForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm?.value;
      this.authService.login(username, password).subscribe({
        next: () => {
          this.router.navigate(['/encuestas']);
        },
        error: (err) => {
          this.errorMessage = 'Credenciales incorrectas';
          console.error(err);
        }
      });
    }
  }

  onRegister(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm?.value;
      this.authService.register(username, password).subscribe({
        next: () => {
          this.showRegisterForm = false;
          this.errorMessage = '';
          alert('Usuario registrado con éxito. Ahora puede iniciar sesión.');
        },
        error: (err) => {
          this.errorMessage = err.error || 'Error al registrar el usuario';
          console.error(err);
        }
      });
    }
  }

  toggleRegisterForm(): void {
    this.showRegisterForm = !this.showRegisterForm;
    this.errorMessage = '';
  }
}