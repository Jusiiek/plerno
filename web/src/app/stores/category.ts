import { Injectable, signal } from '@angular/core';
import { BaseStore } from "./base";
import { SetsService } from "../services/sets";


@Injectable({
  providedIn: 'root'
})
export class CategoryStore extends BaseStore {
  private categories = signal<string[]>([]);
  constructor(private api: SetsService) {
    super();
  }

  get listCategories() {
    return this.categories();
  }

  async fetchCategories(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data } = await this.api.getCategories();
      this.categories.set(data);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load categories');
    }
    this.loading.set(false);
  }
}
