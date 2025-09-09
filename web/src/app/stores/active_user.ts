import { Injectable, signal } from '@angular/core';
import { BaseStore } from "./base";
import { ActiveUserModel } from "../interfaces/active_user";

@Injectable({
  providedIn: 'root',
})
export class ActiveUser extends BaseStore {
  private userData = signal<ActiveUserModel | null>(null)
  private USER_KEY = "USER_DATA"

  constructor() {
    super();
  }

  set(userData: ActiveUserModel) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
      this.userData.set(userData);
    }
  }

  get() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(this.USER_KEY);
      if (data) {
        const parsed = JSON.parse(data) as ActiveUserModel;
        this.userData.set(parsed);
        return parsed;
      }
    }
    return null;
  }

  getToken() {
    this.get();
    return this.userData()?.token ?? null;
  }

  clearUserData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.USER_KEY);
      this.userData.set(null);
    }
  }
}
