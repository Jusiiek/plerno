import { Component } from '@angular/core';
import {NzIconDirective} from "ng-zorro-antd/icon";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NzIconDirective,
    RouterModule
  ],
  template: `
    <div class="p-6 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <button
        [routerLink]="['/tasks']"
        class="flex flex-col items-center justify-center p-6 bg-white shadow rounded-2xl hover:shadow-md transition max-w-[200px]"
      >
        <span
          nz-icon
          nzType="audit"
          nzTheme="outline"
        >
        </span>
        <span class="text-sm font-medium text-gray-700">Tasks</span>
      </button>

      <button
        [routerLink]="['/sets']"
        class="flex flex-col items-center justify-center p-6 bg-white shadow rounded-2xl hover:shadow-md transition max-w-[200px]"
      >
        <span
          nz-icon
          nzType="book"
          nzTheme="outline"
        >
        </span>
        <span class="text-sm font-medium text-gray-700">Flashcards</span>
      </button>
    </div>
  `
})
export class HomeComponent {}

