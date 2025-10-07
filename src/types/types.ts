export interface Todo { //IFullTodo
	id: number;
	title: string;
	created: string; // ISO date string 
	isDone: boolean; 
}

export interface TodoRequest { //ITodo
	title?: string;
 	isDone?: boolean;  
}// или так type TodoRequest = Partial<Omit<Todo, "id" | "created">>; 

export interface TodoInfo { //type TListsInfo = TodoInfo | null мб проблемы на эту тему
	all: number;
	completed: number;
	inWork: number;
}

export type Filter = "all" | "completed" | "inWork"; //TFilter


export interface MetaResponse<T, N> { //<Todo, TFilter>
	data: T[];
	info?: N;
	meta: {
		totalAmount: number;
	}
}
