import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { RouterModule } from '@angular/router';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconDirective, NzIconModule } from 'ng-zorro-antd/icon';
import { AuthService } from "../../services/auth";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    NzAvatarModule,
    RouterModule,
    NzDropDownModule,
    NzIconDirective,
    NzIconModule
  ],
  template: `
    <nav class="w-full h-16 bg-[#40a9ff] flex items-center justify-between px-6">
      <div class="text-white text-xl font-bold cursor-pointer" [routerLink]="['/']">
        Plerno
      </div>

      <div>
        <a nz-dropdown [nzDropdownMenu]="menu" (click)="$event.stopPropagation()">
          <nz-avatar nzIcon="user" nzSize="large"></nz-avatar>
        </a>
        <nz-dropdown-menu #menu="nzDropdownMenu">
          <ul nz-menu nzSelectable>
            <li nz-menu-item (click)="logout()" class="hover:text-gray-700">
              <span
                nz-icon
                nzType="poweroff"
                nzTheme="outline"
              >
              </span>
              Logout
            </li>
          </ul>
        </nz-dropdown-menu>
      </div>
    </nav>`
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}
  async logout() {
    await this.authService.logout();
  }
}
