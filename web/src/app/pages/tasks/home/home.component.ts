import {Component, computed, OnInit} from '@angular/core';
import { DragDropModule, CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import { TaskStore } from "../../../stores/task";
import {CreateTask, TaskModel, UpdateTask} from "../../../interfaces/task";
import {CommonModule} from "@angular/common";
import {FormBuilder, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { NzModalModule } from "ng-zorro-antd/modal";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzInputDirective, NzInputModule} from "ng-zorro-antd/input";
import {NzWaveDirective} from "ng-zorro-antd/core/wave";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import {NzSelectModule} from "ng-zorro-antd/select";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    CdkDropList,
    CdkDrag,
    DragDropModule,
    FormsModule,
    NzModalModule,
    NzButtonComponent,
    NzInputDirective,
    NzWaveDirective,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzInputModule
  ],
  template: `
    <div class="w-full">
      <div class="w-full text-end px-6">
        <button nz-button [nzSize]="'large'" nzType="primary" class="w-full max-w-[150px] ml-auto"
                (click)="openModal(ACTIONS.CREATE)">
          Add a new task
        </button>
      </div>
      <nz-modal [(nzVisible)]="modalData.isVisible"
                [nzTitle]="modalData.action === ACTIONS.UPDATE ? 'Update set' : 'Create a new set'"
                (nzOnCancel)="handleCancel()"
      >
        <div *nzModalContent>
          <form [formGroup]="taskForm" class="space-y-4">
            <div>
              <label class="block mb-1 font-medium">Title</label>
              <input nz-input formControlName="title" placeholder="Enter title"/>
              <div class="text-red-500 text-sm"
                   *ngIf="taskForm.get('title')?.invalid && taskForm.get('title')?.touched">
                Title is required
              </div>
            </div>

            <div>
              <label class="block mb-1 font-medium">Description</label>
              <textarea nz-input formControlName="description" placeholder="Enter description"></textarea>
              <div class="text-red-500 text-sm"
                   *ngIf="taskForm.get('description')?.invalid && taskForm.get('description')?.touched">
                Description is required
              </div>
            </div>

            <div>
              <label class="block mb-1 font-medium">Deadline</label>
              <nz-date-picker
                nzShowTime
                nzFormat="yyyy-MM-dd HH:mm:ss"
                formControlName="deadline"
                (ngModelChange)="onChange($event)"
                (nzOnOk)="onOk($event)"
              ></nz-date-picker>
              <div class="text-red-500 text-sm"
                   *ngIf="taskForm.get('deadline')?.invalid && taskForm.get('deadline')?.touched">
                Deadline is required
              </div>
            </div>

            <div *ngIf="modalData.action === ACTIONS.UPDATE">
              <label class="block mb-1 font-medium">Status</label>
              <nz-select formControlName="status" class="w-full">
                <nz-option *ngFor="let category of Object.values(TASK_STATUS)"
                           [nzValue]="category"
                           [nzLabel]="category">
                </nz-option>
              </nz-select>
            </div>

            <div *ngIf="modalData.action === ACTIONS.UPDATE">
              <label class="block mb-1 font-medium">Done</label>
              <nz-date-picker
                nzShowTime
                nzFormat="yyyy-MM-dd HH:mm:ss"
                formControlName="doneAt"
                nzDisabled
              ></nz-date-picker>
            </div>
          </form>
        </div>
        <div *nzModalFooter>
          <div class="d-flex columns-2">
            <div class="w-100 text-left">
              <button nz-button nzType="default" (click)="handleDelete()" class="bg-red-600 text-white">Delete</button>
            </div>
            <div class="w-100">
              <button nz-button nzType="default" (click)="handleCancel()">Cancel</button>
              <button nz-button nzType="primary" (click)="createUpdateTask()">
                {{ modalData.action === ACTIONS.CREATE ? 'Create' : 'Edit' }}
              </button>
            </div>
          </div>
        </div>
      </nz-modal>
      <div class="grid grid-cols-2 gap-6 p-6 h-[calc(100vh-150px)]">
        <div class="rounded-xl shadow-md relative">
          <h2
            class="text-3xl font-extrabold text-center text-gray-800
             bg-gradient-to-b from-white to-gray-200
             rounded-lg shadow-inner px-4 py-2
             drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]
             border border-gray-300 mb-0"
          >
            TODO
          </h2>
          <div
            class="space-y-3 min-h-[200px] p-4 overflow-y-scroll"
            cdkDropList
            #todoList="cdkDropList"
            [cdkDropListData]="todoTasks()"
            [cdkDropListConnectedTo]="[doneList]"
            (cdkDropListDropped)="drop($event, false)"
          >
            <div
              *ngFor="let task of todoTasks()"
              cdkDrag
              class="bg-white p-4 rounded-lg shadow hover:shadow-xl transition cursor-move"
            >
              <span
                class="cursor-pointer hover:shadow-xl"
                (click)="openModal(ACTIONS.UPDATE, task)"
              >
                {{ task.title }}
              </span>
            </div>
          </div>
        </div>
        <div class="rounded-xl shadow-md relative">
          <h2
            class="text-3xl font-extrabold text-center text-green-800
             bg-gradient-to-b from-white to-green-100
             rounded-lg shadow-inner px-4 py-2
             drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]
             border border-green-300 mb-0"
          >
            DONE
          </h2>
          <div
            class="space-y-3 min-h-[200px] p-4 overflow-y-scroll"
            cdkDropList
            #doneList="cdkDropList"
            [cdkDropListData]="doneTasks()"
            [cdkDropListConnectedTo]="[todoList]"
            (cdkDropListDropped)="drop($event, true)"
          >
            <div
              *ngFor="let task of doneTasks()"
              cdkDrag
              class="bg-green-50 p-4 rounded-lg shadow hover:shadow-xl transition cursor-move"
            >
              <span
                class="cursor-pointer hover:shadow-xl"
                (click)="openModal(ACTIONS.UPDATE, task)"
              >
                {{ task.title }}
              </span>
            </div>
          </div>
        </div>
      </div>


    </div>
  `
})
export class HomeComponent implements OnInit{
  constructor(
    private taskStore: TaskStore,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.taskStore.fetchUserTasks()
  }

  TASK_STATUS = {
    TODO: "TODO",
    DONE: "DONE"
  }

  ACTIONS = {
    CREATE: "CREATE",
    UPDATE: "UPDATE"
  }

  todoTasks = computed(
    () => this.taskStore.UserTasks().filter(
      t => t.status === this.TASK_STATUS.TODO
    )
  )

  doneTasks = computed(
    () => this.taskStore.UserTasks().filter(
      t => t.status === this.TASK_STATUS.DONE
    )
  )
  modalData = {
    isVisible: false,
    action: '',
  }

  taskForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    deadline: [null as Date | null, Validators.required],
    status: [''],
    doneAt: [null as Date | null],
    taskId: ['']
  })

  async openModal(action: string, taskToUpdate?: TaskModel) {
    this.modalData.action = action

    if (action === this.ACTIONS.UPDATE && taskToUpdate) {
      this.taskForm.patchValue({
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        deadline: taskToUpdate.deadline,
        status: taskToUpdate.status,
        doneAt: taskToUpdate.doneAt,
        taskId: taskToUpdate.id,
      })
    }
    this.modalData.isVisible = true
  }

  async updateTask() {
    if (this.taskForm.invalid) return;
    const formValue = this.taskForm.value;

    const doneAtValue = formValue.status === this.TASK_STATUS.DONE ? new Date(formValue.doneAt!) : null;

    const body: UpdateTask = {
      title: formValue.title!,
      description: formValue.description!,
      deadline: new Date(formValue.deadline!),
      status: formValue.status!,
      doneAt: doneAtValue,
    };

    await this.taskStore.updateTask(formValue.taskId!, body);
    await this.handleCancel()
    await this.taskStore.fetchUserTasks();
  }

  async createTask() {
    if (this.taskForm.invalid) return;

    const formValue = this.taskForm.value;

    const body: CreateTask = {
      title: formValue.title!,
      description: formValue.description!,
      deadline: new Date(formValue.deadline!)
    };

    await this.taskStore.createTask(body);
    await this.handleCancel()
    await this.taskStore.fetchUserTasks();
  }

  async createUpdateTask() {
    if (this.modalData.action === this.ACTIONS.CREATE) await this.createTask();
    else if (this.modalData.action === this.ACTIONS.UPDATE) await this.updateTask();
  }

  async handleCancel() {
    this.modalData.isVisible = false;
    this.modalData.action = '';

    this.taskForm.reset({
      title: '',
      description: '',
      deadline: null,
      status: '',
      doneAt: null,
      taskId: ''
    });
  }

  async handleDelete() {
    const formValue = this.taskForm.value;
    if (formValue.taskId) {
      await this.taskStore.deleteTask(formValue.taskId)
      await this.handleCancel()
    }
  }

  async drop(event: CdkDragDrop<TaskModel[]>, targetDone: boolean) {
    console.log("ASUDASIBDISUADBUIASIUDBASIDSBUI", event, targetDone)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const movedTask = event.container.data[event.currentIndex];
      const body: UpdateTask = {...movedTask, status: targetDone ? this.TASK_STATUS.DONE : this.TASK_STATUS.TODO};
      await this.taskStore.updateTask(movedTask.id, body);
    }
  }
  onChange(result: Date): void {
    this.taskForm.get('deadline')?.setValue(result);
  }

  onOk(result: Date | Date[] | null): void {
    if (result instanceof Date || result === null) {
      this.taskForm.get('deadline')?.setValue(result);
    }
  }

  protected readonly Object = Object;
}
