import type { RolesValues, PermissionActionValues } from "@/types/admin.types";


export enum PermissionAction {
  UserView = 'user.view',
  UserEdit = 'user.edit',
  UserDelete = 'user.delete', 
  UserBlock = 'user.block', //доступно блокировать/разблокировать юзера
  UserBlockFilter = 'user.block.filter', //доступна фильтрация по блокировке
  UserRoles = 'user.roles', 
}


type PermissionMap = {
  [K in PermissionActionValues]: RolesValues[];
}

export const PERMISSIONS_MAP: PermissionMap = {
  'user.view': ['ADMIN', 'MODERATOR'],
  'user.edit': ['ADMIN', 'MODERATOR'],
  'user.delete': ['ADMIN'],
  'user.block': ['ADMIN', 'MODERATOR'],
  'user.block.filter': ['ADMIN'],
  'user.roles': ['ADMIN'],
};