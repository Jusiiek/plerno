import { Injectable, signal } from '@angular/core';
import { BaseStore } from "./base";
import { FlashcardService } from "../services/flashcard";
import { CreateFlashcard, UpdateFlashcard, FlashcardModel } from "../interfaces/flashcard";

@Injectable({
  providedIn: 'root'
})
export class FlashcardStore extends BaseStore {

  private flashcards = signal<FlashcardModel[]>([]);
  constructor(private api: FlashcardService) {
    super();
  }

  get setsFlashcards() {
    return this.flashcards.asReadonly();
  }

  async fetchSetFlashcards(setId: string) {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data } = await this.api.getSetCards(setId);
      this.flashcards.set(data);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load tasks');
    } finally {
      this.loading.set(false);
    }
    this.loading.set(false);
  }

  async createFlashcards(setId:string, body: CreateFlashcard) {
    await this.api.createFlashcard(setId, body);
    await this.fetchSetFlashcards(setId);
  }

  async updateFlashcards(id: string, body: UpdateFlashcard) {
    await this.api.updateFlashcard(id, body);
  }

  async deleteFlashcards(id: string) {
    await this.api.deleteFlashcard(id);
  }
}
