import { Injectable } from '@angular/core';
import { ApiService } from "../utils/request";
import { CreateSet, UpdateSet, SetModel } from "../interfaces/set";
import { REQUEST_METHODS } from "../common/request_methods";
import { BaseService } from "./base";

@Injectable({
  providedIn: 'root'
})
export class SetsService extends BaseService {
  constructor(private api: ApiService) {
    super()
  }

  async createSet(body: CreateSet) {
    return await this.api.request<SetModel>({
      url: `${this.API_HOST}/flashcard_set/`,
      method: REQUEST_METHODS.POST,
      body
    });
  }

  async updateSet(id: string, body: UpdateSet) {
    return await this.api.request<SetModel>({
      url: `${this.API_HOST}/flashcard_set/${id}`,
      method: REQUEST_METHODS.PUT,
      body
    });
  }

  async deleteSet(id: string) {
    return await this.api.request<SetModel>({
      url: `${this.API_HOST}/flashcard_set/${id}`,
      method: REQUEST_METHODS.DELETE
    });
  }

  async getSet(id: string) {
    return await this.api.request<SetModel>({
      url: `${this.API_HOST}/flashcard_set/${id}`,
      method: REQUEST_METHODS.GET
    });
  }

  async getUserSets() {
    return await this.api.request<SetModel[]>({
      url: `${this.API_HOST}/flashcard_set/user`
    });
  }

  async getCategories() {
    return await this.api.request<string[]>({
      url: `${this.API_HOST}/flashcard_set/category`
    });
  }
}
