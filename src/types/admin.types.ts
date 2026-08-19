import type { PermissionAction } from "@/constants/permission";


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
// Интерфейс метаинформации

export interface MetaResponse<T> { 
  data: T[]
  meta: {   
    totalAmount: number;   
    sortBy: string;   
    sortOrder: 'asc' | 'desc'; 
  }
}
// Интерфейс для обновления прав пользователя
export interface UserRolesRequest {  
  roles: Roles[]
}

// Интерфейс для обновления данных пользователя
export interface UserRequest{  
  username?: string; 
  email?: string; 
  phoneNumber?: string;
}

export enum Roles {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  USER = "USER",
}

// type RolesValues = typeof Roles [keyof typeof Roles];
export type RolesValues = `${Roles}`;
export type PermissionActionValues = typeof PermissionAction[keyof typeof PermissionAction];

// // Интерфейс запроса для фильтрации и сортировки пользователей
// interface UserFilters { 
//   search?: string;
//   sortBy?: string;
//   sortOrder?: 'asc' | 'desc';
//   isBlocked?: boolean;
//   limit?: number;  // сколько на странице
//   page?: number;  // страницу
// }

export interface Params {
  search?: string,
  sortBy?: 'username' | 'email' | 'id',
  sortOrder?: 'asc' | 'desc' | 'none',
  isBlocked?: boolean | 'all',
  limit?: number,
  page?: number,
}
