import {Component, inject, OnInit, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlashCardComponent, FlashCardModel } from '../../../components/flash-card/flash-card.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FlashcardStore } from "../../../stores/flashcard";
import {ActivatedRoute} from "@angular/router";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [CommonModule, FlashCardComponent, NzButtonModule, NzIconDirective],
  template: `
    <div class="flex flex-col items-center justify-center h-full w-full p-6">
      <div
        class="w-full flex flex-col items-center justify-center"
        *ngIf="flashcardStore.isLoading()"
      >
        <h2 class="text-2xl font-bold mb-6">
          <span nz-icon nzType="loading" nzTheme="outline"></span>
          Loading your game
        </h2>
      </div>
      <div class="w-full flex flex-col items-center justify-center" *ngIf="!flashcardStore.isLoading()">

        <h2 class="text-2xl font-bold mb-6">Learning Mode</h2>

        <div class="flex items-center space-x-6">
          <button
            nz-button
            nzType="default"
            (click)="prevCard()"
            [disabled]="currentIndex === 0">
            ◀
          </button>

          <app-flash-card
            *ngIf="currentCard"
            [flashCard]="currentCard"
            class="w-[400px]"
          >
          </app-flash-card>

          <button
            nz-button
            nzType="default"
            (click)="nextCard()"
            [disabled]="currentIndex === flashCardList().length - 1">
            ▶
          </button>
        </div>

        <!-- Progress -->
        <div class="mt-4 text-gray-600">
          {{ currentIndex + 1 }} / {{ flashCardList().length }}
        </div>
      </div>
    </div>
  `
})
export class LearnComponent implements OnInit {
  setId!: string;

  constructor(public flashcardStore: FlashcardStore) {}

  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.setId = this.route.snapshot.paramMap.get('setId')!;
    this.flashcardStore.fetchSetFlashcards(this.setId);
  }

  currentIndex = 0;
  flashCardList = computed(() => this.flashcardStore.setsFlashcards());

  get currentCard(): FlashCardModel | undefined {
    return this.flashCardList()[this.currentIndex];
  }

  nextCard() {
    if (this.currentIndex < this.flashCardList().length - 1) {
      this.currentIndex++;
    }
  }

  prevCard() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
}
