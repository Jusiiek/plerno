import {signal} from "@angular/core";

export abstract class BaseStore {
  constructor() {}

  protected loading = signal(false);
  protected error = signal<string | null>(null);

  get isLoading() {
    return this.loading.asReadonly();
  }
  get errorMessage() {
    return this.error.asReadonly();
  }
}

