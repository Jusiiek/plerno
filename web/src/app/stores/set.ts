import { Injectable, signal, computed } from '@angular/core';
import { CreateSet, UpdateSet, SetModel } from "../interfaces/set";
import { SetsService } from "../services/sets";
import { BaseStore } from "./base";

@Injectable({
  providedIn: 'root'
})
export class SetStore extends BaseStore {
  private sets = signal<SetModel[]>([]);
  private set = signal<SetModel | null>(null)

  constructor(private api: SetsService) {
    super();
  }

  get userSets() {
    return this.sets.asReadonly();
  }

  get setData() {
    return this.set();
  }

  count = computed(() => this.sets().length);

  async fetchUserSets() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data } = await this.api.getUserSets();
      this.sets.set(data);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load sets');
    } finally {
      this.loading.set(false);
    }
  }

  async fetchSetDetails(id: string) {
    this.loading.set(true);
    const { data } = await this.api.getSet(id);
    this.set.set(data);
    this.loading.set(false);
  }

  async createSet(body: CreateSet) {
    await this.api.createSet(body);
    await this.fetchUserSets();
  }

  async updateSet(id: string, body: UpdateSet) {
    await this.api.updateSet(id, body);
    await this.fetchSetDetails(id);
  }

  async deleteSet(id: string) {
    await this.api.deleteSet(id);
    await this.fetchUserSets();
  }
}
