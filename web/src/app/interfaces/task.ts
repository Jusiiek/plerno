export interface CreateTask {
  title: string;
  description: string;
  deadline: Date
  doneAt?: Date | null;
}

export interface UpdateTask extends CreateTask {
  status: string;
}

export interface TaskModel extends UpdateTask {
  id: string;
  createdAt: Date;
}
