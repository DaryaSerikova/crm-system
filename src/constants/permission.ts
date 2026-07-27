import type { RolesValues, PermissionActionValues } from "@/types/admin.types";


export enum PermissionAction {
  UserView = 'user.view', //moder, ad // короче user'ам нельзя
  UserEdit = 'user.edit', //moder ad
  UserDelete = 'user.delete', //ad
  // UserFilter = 'user.filter', //moder ad ??? вообще нужен?
  UserBlock = 'user.block', //moder ad чет я запуталась тут
  UserRoles = 'user.roles', //ad 
}


type PermissionMap = {
  [K in PermissionActionValues]: RolesValues[];
}

export const PERMISSIONS_MAP: PermissionMap = { //пересмотреть
  'user.view': ['ADMIN', 'MODERATOR'],
  'user.edit': ['ADMIN', 'MODERATOR'],
  'user.delete': ['ADMIN'],

  // 'user.filter': 
  'user.block': ['ADMIN', 'MODERATOR'],
  'user.roles': ['ADMIN'],
};