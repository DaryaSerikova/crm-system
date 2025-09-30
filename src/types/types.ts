export interface IFullTodo {
  created: string,
  id: number,
  isDone: boolean,
  title: string,
}

export type TListsInfo = {
  all: number,
  completed: number,
  inWork: number,
} | null;

export type TFilter = "all" | "completed" | "inWork";
