import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzCardModule} from 'ng-zorro-antd/card';
import {AuthService} from "../../../services/auth";
import {Router, RouterModule} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzCardModule,
    RouterModule
  ],
  template: `
    <div class="flex items-center justify-center w-screen h-screen">
      <nz-card class="w-full max-w-[800px]" nzTitle="Register">
        <form nz-form [formGroup]="form">
          <div class="mb-4">
            <input nz-input formControlName="email" placeholder="Email"/>
            <div class="text-red-500 text-sm" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
              Missing Email
            </div>
          </div>

          <div class="mb-4">
            <input nz-input formControlName="password" placeholder="Password" type="password" />
            <div class="text-red-500 text-sm" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
              Missing Password
            </div>
          </div>

          <div class="flex items-right ant-flex-justify-end w-full">
            <button nz-button [nzSize]="'large'" nzType="text" class="mr-5" [routerLink]="['/auth/login']">
              Already have an account
            </button>
            <button nz-button [nzSize]="'large'" nzType="primary" class="w-full max-w-[100px]" (click)="onSubmit()">
              Register
            </button>
          </div>
        </form>
      </nz-card>
    </div>
  `
})
export class RegisterComponent {

  form = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit() {
    if (this.form.valid) {
      const { email, password } = this.form.value;
      if (email && password) {
        const { res } = await this.authService.register(email, password);
        if (res.status === 201) {
          await this.router.navigate(['/auth/login']);
        }
      }
    }
  }
}
