export interface CreateSet {
  title: string;
  description: string;
  category: string;
}

export interface UpdateSet extends CreateSet {}
export interface SetModel extends UpdateSet {
  id: string;
}
