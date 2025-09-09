import { Injectable } from '@angular/core';
import { ApiService } from "../utils/request";
import { CreateTask, UpdateTask, TaskModel } from "../interfaces/task";
import { REQUEST_METHODS } from "../common/request_methods";
import { BaseService } from "./base";

@Injectable({
  providedIn: 'root'
})
export class TasksService extends BaseService {
  constructor(private api: ApiService) {
    super()
  }

  async getUserTasks() {
    return await this.api.request<TaskModel[]>({
      url: `${this.API_HOST}/tasks/userTasks`,
    });
  }

  async createTask(body: CreateTask) {
    return await this.api.request<TaskModel>({
      url: `${this.API_HOST}/tasks/`,
      method: REQUEST_METHODS.POST,
      body
    });
  }

  async updateTask(id: string, body: UpdateTask) {
    return await this.api.request<TaskModel>({
      url: `${this.API_HOST}/tasks/${id}`,
      method: REQUEST_METHODS.PUT,
      body
    });
  }

  async deleteTask(id: string) {
    return await this.api.request<TaskModel>({
      url: `${this.API_HOST}/tasks/${id}`,
      method: REQUEST_METHODS.DELETE
    });
  }
}
