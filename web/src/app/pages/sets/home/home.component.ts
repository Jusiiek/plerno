import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetCardComponent } from "../../../components/set-card/set-card.component";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import { NzModalModule } from 'ng-zorro-antd/modal';
import {FormBuilder, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CreateSet } from "../../../interfaces/set";
import { SetStore } from "../../../stores/set";
import { CategoryStore } from "../../../stores/category";
import { NzIconDirective, NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SetCardComponent,
    CommonModule,
    NzButtonModule,
    NzWaveDirective,
    NzModalModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconDirective,
    NzIconModule,
    NzSelectModule,
    FormsModule
  ],
  template: `
    <div class="w-full">
      <div class="flex items-right ant-flex-justify-end w-full">
        <button nz-button [nzSize]="'large'" nzType="primary" class="w-full max-w-[150px]" (click)="showModal()">
          Add a new set
        </button>
        <nz-modal [(nzVisible)]="isVisible" nzTitle="Create a new set" (nzOnCancel)="handleCancel()">
          <div *nzModalContent>
            <form [formGroup]="setForm" class="space-y-4">
              <div>
                <label class="block mb-1 font-medium">Title</label>
                <input nz-input formControlName="title" placeholder="Enter title"/>
                <div class="text-red-500 text-sm"
                     *ngIf="setForm.get('title')?.invalid && setForm.get('title')?.touched">
                  Title is required
                </div>
              </div>

              <div>
                <label class="block mb-1 font-medium">Description</label>
                <textarea nz-input formControlName="description" placeholder="Enter description"></textarea>
              </div>

              <div>
                <label class="block mb-1 font-medium">Category</label>
                <nz-select formControlName="category" class="w-full">
                  <nz-option *ngFor="let category of categoryStore.listCategories"
                             [nzValue]="category"
                             [nzLabel]="category">
                  </nz-option>
                </nz-select>
                <div class="text-red-500 text-sm"
                     *ngIf="setForm.get('category')?.invalid && setForm.get('category')?.touched">
                  Category is required
                </div>
              </div>
            </form>
          </div>
          <div *nzModalFooter>
            <button nz-button nzType="default" (click)="handleCancel()">Cancel</button>
            <button nz-button nzType="primary" (click)="handleOk()" [nzLoading]="isConfirmLoading">Create</button>
          </div>
        </nz-modal>
      </div>
      <div class="w-full flex items-center justify-center">
        <div *ngIf="setStore.isLoading()">
          <span nz-icon nzType="loading" nzTheme="outline"></span>
          <span>Loading your data</span>
        </div>

        <div *ngIf="!setStore.isLoading() && setList().length === 0">
          <span>No sets have been created.</span>
        </div>

        <div
          *ngIf="!setStore.isLoading() && setList().length > 0"
          class="p-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4"
        >
          <app-set-card *ngFor="let s of setList()" [set]="s"></app-set-card>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public setStore: SetStore,
    public categoryStore: CategoryStore
  ) {}

  setForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required]
  });

  isVisible = false;
  isConfirmLoading = false;

  ngOnInit() {
    this.setStore.fetchUserSets();
    this.categoryStore.fetchCategories();
  }
  setList = computed(() => this.setStore.userSets());


  showModal() {
    this.resetForm();
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
    this.isConfirmLoading = false;
    this.resetForm();
  }

  resetForm() {
    this.setForm.reset({
      title: '',
      description: '',
      category: ''
    });
  }

  async handleOk(): Promise<void> {
    if (this.setForm.invalid) return;

    this.isConfirmLoading = true;

    await this.setStore.createSet(this.setForm.value as CreateSet);

    setTimeout(() => {
      this.handleCancel();
    }, 500);

    this.isConfirmLoading = false;
  }
}
