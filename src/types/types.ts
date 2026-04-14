export interface Todo {
	id: number;
	title: string;
	created: string;
	isDone: boolean; 
}

export interface TodoRequest {
	title?: string;
 	isDone?: boolean;  
}

export interface TodoInfo { 
	all: number;
	completed: number;
	inWork: number;
}

export type Filter = "all" | "completed" | "inWork";


export interface MetaResponse<T, N> {
	data: T[];
	info?: N;
	meta: {
		totalAmount: number;
	}
}

//---

export interface UserRegistration { 
  login: string; 
  username: string; 
  password: string; 
  email: string; 
  phoneNumber: string; 
}

type Role = 'ADMIN' | 'USER' | 'MODERATOR';

export interface Profile { 
	id: number; 
	username: string; 
	email: string; 
	date: string; 
	isBlocked: boolean; 
	roles: Role[]; 
	phoneNumber: string; 
}

export interface AuthData { 
  login: string; 
  password: string; 
}

export interface Token {
	accessToken: string
	refreshToken: string
 }

// export interface RefreshToken { 
//   refreshToken: string; 
// }


// interface ProfileRequest { 
//   username: string; 
//   email: string; 
//   phoneNumber: string; 
// }

// interface PasswordRequest { 
//   password: string; 
// }



