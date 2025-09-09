import { Injectable, signal } from '@angular/core';
import { CreateTask, UpdateTask, TaskModel } from "../interfaces/task";
import { TasksService } from "../services/tasks";
import { BaseStore } from "./base";

@Injectable({
  providedIn: 'root'
})
export class TaskStore extends BaseStore {

  private tasks = signal<TaskModel[]>([]);
  constructor(private api: TasksService) {
    super();
  }

  get UserTasks() {
    return this.tasks.asReadonly();
  }

  async fetchUserTasks() {
    this.loading.set(true);
    this.error.set(null);

    try {
      const { data } = await this.api.getUserTasks();
      this.tasks.set(data);
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load tasks');
    } finally {
      this.loading.set(false);
    }
  }

  async createTask(body: CreateTask) {
    await this.api.createTask(body);
    await this.fetchUserTasks();
  }

  async updateTask(id: string, body: UpdateTask) {
    await this.api.updateTask(id, body);
    await this.fetchUserTasks();
  }

  async deleteTask(id: string) {
    await this.api.deleteTask(id);
    await this.fetchUserTasks();
  }
}
