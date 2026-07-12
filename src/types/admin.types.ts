// // Интерфейс запроса для фильтрации и сортировки пользователей
// interface UserFilters { 
//   search?: string;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
//   isBlocked?: boolean;
//   limit?: number;  // сколько на странице
//   page?: number;  // страницу
// }

// Интерфейс пользователя
export interface User {
  id: number;
  username: string;
  email: string;
  date: string; // ISO date string 
  isBlocked: boolean;
  roles: Roles[]; 
  phoneNumber: string;
}
// // Интерфейс метаинформации

// interface MetaResponse<T> { 
//   data: T[]
//   meta: {   
//     totalAmount: number;   
//     sortBy: string;   
//     sortOrder: 'asc' | 'desc'; 
//   }
// }
// // Интерфейс для обновления прав пользователя
// interface UserRolesRequest {  
//   roles: Roles []  // при вызове этой апи роли будут обновлены к тому массиву который будет передан
// // например если у вас была roles: ['ADMIN'] а вы хотите добавить ['MODERATOR'] то нужно передавать 
// // старые + новые - roles: ['ADMIN', 'MODERATOR'] 
// }

// Интерфейс для обновления данных пользователя
export interface UserRequest{  
  username?: string; 
  email?: string; 
  phoneNumber?: string;
}

export const enum Roles {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}


export type SortBy = 'username' | 'email' | 'id';
export type SortOrder = 'username' | 'email' | 'none';

export interface Params {
  sortBy?: SortBy,
  sortOrder?: SortOrder,
}
