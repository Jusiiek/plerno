import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import {NavbarComponent} from "../../components/navbar/navbar.component";

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, NzLayoutModule, NavbarComponent],
  template: `
    <nz-layout class="h-screen">
      <nz-layout>
        <nz-header class="p-0">
          <app-navbar />
        </nz-header>
        <nz-content class="p-6 bg-white">
          <router-outlet></router-outlet>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `
})
export class MainLayoutComponent {}
