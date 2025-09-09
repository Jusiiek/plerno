import { Component, Input } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterModule } from '@angular/router';
import {FormBuilder} from "@angular/forms";
import { SetModel } from "../../interfaces/set";

@Component({
  selector: 'app-set-card',
  standalone: true,
  imports: [
    NzCardModule,
    RouterModule
  ],
  template: `
    <a
      [routerLink]="['/sets', set.id]"
      class="block"
    >
      <nz-card
        [nzTitle]="set.title"
        class="mb-4 w-full max-w-[400px] h-[200px] rounded cursor-pointer hover:shadow-lg transition-all duration-300"
      >
        <p class="text-gray-600">{{ set.description }}</p>
      </nz-card>
    </a>
  `
})
export class SetCardComponent {
  @Input() set!: SetModel;

  constructor(private fb: FormBuilder) {}
}
