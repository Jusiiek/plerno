import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import {NzIconDirective, NzIconModule} from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import {FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import { UpdateFlashcard } from "../../interfaces/flashcard";

export interface FlashCardModel {
  id: string;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-flash-card',
  standalone: true,
  imports: [
    CommonModule,
    NzDropDownModule,
    NzIconModule,
    NzIconDirective,
    NzModalModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonComponent,
    NzWaveDirective
  ],
  template: `
    <div
      class="relative w-full h-40 cursor-pointer border border-gray-200 rounded-lg perspective hover:shadow-lg transition-all duration-300"
      (click)="isFlipped = !isFlipped"
    >
      <nz-modal [(nzVisible)]="isVisible" nzTitle="Update set data" (nzOnCancel)="handleCancel()">
        <div *nzModalContent>
          <form [formGroup]="flashcardForm" class="space-y-4">
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
          <button nz-button nzType="primary" (click)="handleOk()" [nzLoading]="isConfirmLoading">Update</button>
        </div>
      </nz-modal>
      <div class="absolute top-2 right-2 z-20">
        <a nz-dropdown [nzDropdownMenu]="menu" (click)="$event.stopPropagation()">
          <span nz-icon nzType="more" nzTheme="outline" class="text-gray-500 hover:text-gray-700"></span>
        </a>
        <nz-dropdown-menu #menu="nzDropdownMenu">
          <ul nz-menu nzSelectable>
            <li nz-menu-item (click)="showModal()">✏️ Edit</li>
            <li nz-menu-item nzDanger (click)="deleteHandler()">🗑️ Delete</li>
          </ul>
        </nz-dropdown-menu>
      </div>

      <div
        class="relative w-full h-full transition-transform duration-500 transform-style-preserve-3d"
        [class.rotate-y-180]="isFlipped"
      >
        <div
          class="absolute inset-0 flex items-center justify-center backface-hidden rounded-lg shadow-md bg-white p-4"
        >
          <p class="font-semibold text-center">{{ flashCard.question }}</p>
        </div>

        <div
          class="absolute inset-0 flex items-center justify-center backface-hidden rounded-lg shadow-md bg-blue-50 rotate-y-180 p-4"
        >
          <p class="text-gray-800 text-center">{{ flashCard.answer }}</p>
        </div>
      </div>
    </div>

  `,
  styles: [`
    .perspective {
      perspective: 1000px;
    }
    .transform-style-preserve-3d {
      transform-style: preserve-3d;
    }
    .backface-hidden {
      backface-visibility: hidden;
    }
    .rotate-y-180 {
      transform: rotateY(180deg);
    }
  `]
})
export class FlashCardComponent {
  @Input() flashCard!: FlashCardModel;
  @Output() edit = new EventEmitter<{ id: string; body: UpdateFlashcard }>();
  @Output() delete = new EventEmitter<string>();

  constructor(private fb: FormBuilder) {}

  isFlipped = false;
  isVisible = false;
  isConfirmLoading = false;

  flashcardForm = this.fb.group({
    question: ['', Validators.required],
    answer: ['', Validators.required]
  });

  showModal() {
    this.resetForm();
    if (this.flashCard) {
      this.flashcardForm.patchValue({
        answer: this.flashCard.answer,
        question: this.flashCard.question
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
    this.flashcardForm.reset({
      answer: '',
      question: ''
    });
  }

  async handleOk(): Promise<void> {
    this.isConfirmLoading = true;
    await this.editHandler();
    setTimeout(() => {
      this.handleCancel()
    }, 1000);
  }

  async editHandler() {
    this.edit.emit({
      id: this.flashCard.id,
      body: this.flashcardForm.value as UpdateFlashcard
    });
    await this.resetForm();
  }

  async deleteHandler() {
    this.delete.emit(this.flashCard.id);
  }
}
