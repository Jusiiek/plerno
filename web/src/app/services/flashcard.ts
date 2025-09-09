import { Injectable } from '@angular/core';
import { ApiService } from "../utils/request";
import { CreateFlashcard, UpdateFlashcard, FlashcardModel } from "../interfaces/flashcard";
import { REQUEST_METHODS } from "../common/request_methods";
import { BaseService } from "./base";

@Injectable({
  providedIn: 'root'
})
export class FlashcardService extends BaseService {
  constructor(private api: ApiService) {
    super()
  }

  async getSetCards(setId: string) {
    return await this.api.request<FlashcardModel[]>({
      url: `${this.API_HOST}/flashcard/${setId}`
    });
  }

  async createFlashcard(setId: string, body: CreateFlashcard) {
    return await this.api.request<FlashcardModel>({
      url: `${this.API_HOST}/flashcard/${setId}`,
      method: REQUEST_METHODS.POST,
      body
    });
  }

  async updateFlashcard(id: string, body: UpdateFlashcard) {
    return await this.api.request<FlashcardModel>({
      url: `${this.API_HOST}/flashcard/${id}`,
      method: REQUEST_METHODS.PUT,
      body
    });
  }

  async deleteFlashcard(id: string) {
    return await this.api.request<FlashcardModel>({
      url: `${this.API_HOST}/flashcard/${id}`,
      method: REQUEST_METHODS.DELETE
    });
  }
}
