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