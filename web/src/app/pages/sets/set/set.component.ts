import {Component, computed, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashCardComponent } from '../../../components/flash-card/flash-card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SetStore } from "../../../stores/set";
import { FlashcardStore } from "../../../stores/flashcard";
import {CreateFlashcard, UpdateFlashcard} from "../../../interfaces/flashcard";
import { UpdateSet } from "../../../interfaces/set";
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CategoryStore } from "../../../stores/category";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FlashCardComponent,
    NzButtonModule,
    RouterModule,
    NzModalModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold">
          {{ setStore.setData?.title || "" }}
        </h2>
        <div>
          <button
            nz-button
            [nzSize]="'large'"
            nzType="primary"
            class="rounded-lg shadow hover:shadow-md transition mr-3"
            (click)="showModal(ACTIONS.CREATE_FLASHCARD)"
          >
            Add flashcard
          </button>
          <button
            nz-button
            [nzSize]="'large'"
            nzType="primary"
            class="rounded-lg shadow hover:shadow-md transition mr-3"
            (click)="isManageModalVisible = true"
          >
            Manage
          </button>
          <button
            nz-button
            [nzSize]="'large'"
            nzType="primary"
            class="rounded-lg shadow hover:shadow-md transition bg-green-600 hover:bg-green-500 border border-green-600"
            (click)="goToLearn()"
            [disabled]="flashCardList().length === 0"
          >
            Learn
          </button>
        </div>
      </div>

      <nz-modal
        [(nzVisible)]="isManageModalVisible"
        [nzTitle]="'Manage'"
        (nzOnCancel)="isManageModalVisible = false"
      >
        <div *nzModalContent>
          <div class="flex flex-col items-stretch space-y-3">
            <button
              nz-button
              [nzSize]="'large'"
              nzType="primary"
              class="max-w-[200px] ml-auto mr-auto rounded-lg shadow hover:shadow-md transition bg-orange-600 hover:bg-orange-500 border border-orange-600"
              (click)="showModal(ACTIONS.UPDATE_SET)"
            >
              Edit Set
            </button>
            <button
              nz-button
              [nzSize]="'large'"
              nzType="primary"
              class="max-w-[200px] ml-auto mr-auto rounded-lg shadow hover:shadow-md transition bg-red-600 hover:bg-red-500 border border-red-600"
              (click)="deleteSet()"
            >
              Delete
            </button>
          </div>
        </div>
        <div *nzModalFooter class="border-none">
        </div>
      </nz-modal>

      <nz-modal
        [(nzVisible)]="isVisible"
        [nzTitle]="action === ACTIONS.UPDATE_SET ? 'Update set data' : 'Create a flashcard'"
        (nzOnCancel)="handleCancel()"
      >
        <div *nzModalContent>
          <form [formGroup]="setForm" class="space-y-4" *ngIf="action === ACTIONS.UPDATE_SET">
            <div>
              <label class="block mb-1 font-medium">Title</label>
              <input nz-input formControlName="title" placeholder="Enter title"/>
              <div class="text-red-500 text-sm" *ngIf="setForm.get('title')?.invalid && setForm.get('title')?.touched">
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
          <form [formGroup]="flashcardForm" class="space-y-4" *ngIf="action === ACTIONS.CREATE_FLASHCARD">
            <div>
              <label class="block mb-1 font-medium">Question</label>
              <input nz-input formControlName="question" placeholder="Enter question"/>
              <div class="text-red-500 text-sm"
                   *ngIf="flashcardForm.get('question')?.invalid && flashcardForm.get('question')?.touched">
                Question is required
              </div>
            </div>

            <div>
              <label class="block mb-1 font-medium">Answer</label>
              <input nz-input formControlName="answer" placeholder="Enter answer"/>
              <div class="text-red-500 text-sm"
                   *ngIf="flashcardForm.get('answer')?.invalid && flashcardForm.get('answer')?.touched">
                Answer is required
              </div>
            </div>
          </form>
        </div>
        <div *nzModalFooter>
          <button nz-button nzType="default" (click)="handleCancel()">Cancel</button>
          <button nz-button nzType="primary" (click)="handleOk()" [nzLoading]="isConfirmLoading">
            {{ action === ACTIONS.UPDATE_SET ? 'Update' : 'Create' }}
          </button>
        </div>
      </nz-modal>

      <div class="p-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        <div *ngFor="let card of flashCardList()" class="relative">
          <app-flash-card
            [flashCard]="card"
            (edit)="editFlashcard($event)"
            (delete)="deleteFlashcard($event)"
          >

          </app-flash-card>
        </div>
      </div>
    </div>
  `
})
export class MainComponent implements OnInit {
  setId!: string;

  constructor(
    private fb: FormBuilder,
    public setStore: SetStore,
    public flashcardStore: FlashcardStore,
    public categoryStore: CategoryStore,
  ) {}

  private router = inject(Router);
  private route = inject(ActivatedRoute);


  ngOnInit() {
    this.setId = this.route.snapshot.paramMap.get('setId')!;
    this.setStore.fetchSetDetails(this.setId);
    this.flashcardStore.fetchSetFlashcards(this.setId);
    this.categoryStore.fetchCategories();
  }

  ACTIONS = {
    UPDATE_SET: 'UPDATE_SET',
    CREATE_FLASHCARD: 'CREATE_FLASHCARD',
  }

  action = "";

  setForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    category: ['', Validators.required]
  });

  flashcardForm = this.fb.group({
    question: ['', Validators.required],
    answer: ['', Validators.required]
  });

  isVisible = false;
  isConfirmLoading = false;
  isManageModalVisible = false;

  flashCardList = computed(() => this.flashcardStore.setsFlashcards());

  showModal(action: string) {
    this.resetForm();

    this.action = action;

    if (this.setStore.setData && this.action === this.ACTIONS.UPDATE_SET) {
      this.setForm.patchValue({
        title: this.setStore.setData.title,
        description: this.setStore.setData.description || '',
        category: this.setStore.setData.category
      });
    }
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
    this.isConfirmLoading = false;
    this.resetForm();
  }

  resetForm() {
    this.action = "";
    this.setForm.reset({
      title: '',
      description: '',
      category: ''
    });

    this.flashcardForm.reset({
      question: '',
      answer: '',
    });
  }

  async handleOk(): Promise<void> {
    this.isConfirmLoading = true;

    if (this.action === this.ACTIONS.UPDATE_SET)
      await this.updateSet();
    else if (this.action === this.ACTIONS.CREATE_FLASHCARD)
      await this.createFlashcard();

    setTimeout(() => {
      this.handleCancel()
      this.resetForm();
    }, 500);
  }

  async updateSet() {
    if(this.setForm.invalid) return;
    await this.setStore.updateSet(
      this.setId,
      this.setForm.value as UpdateSet
    )
  }
  async createFlashcard() {
    if(this.flashcardForm.invalid) return;
    await this.flashcardStore.createFlashcards(
      this.setId,
      this.flashcardForm.value as CreateFlashcard
    )
  }

  async editFlashcard(event: { id: string; body: UpdateFlashcard }) {
    await this.flashcardStore.updateFlashcards(
      event.id,
      event.body
    )
    await this.flashcardStore.fetchSetFlashcards(this.setId);
  }

  async deleteFlashcard(flashcardId: string) {
    await this.flashcardStore.deleteFlashcards(flashcardId);
    await this.flashcardStore.fetchSetFlashcards(this.setId);
  }

  async deleteSet() {
    await this.setStore.deleteSet(this.setId);
    this.isManageModalVisible = false;
    await this.router.navigate(['/sets']);

  }

  goToLearn() {
    if (this.setId) {
      this.router.navigate([`/sets/${this.setId}/learn`]);
    }
  }

}
