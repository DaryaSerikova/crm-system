import type { RolesValues, PermissionActionValues } from "@/types/admin.types";
import { useAppSelector } from "@/store/hooks";
import { PERMISSIONS_MAP } from "@/constants/permission";

export const usePermission = (userAction = 'user.view') => {
  const user = useAppSelector((state) => state.user); 

  const allowedRoles = PERMISSIONS_MAP[userAction as PermissionActionValues];
  let isAllowedAction = null;

  if(user.roles === null) {
    return { isAllowedAction: false };
  }

  const hasRole = (_allowedRoles: RolesValues | RolesValues[]): boolean => {
    if (!user) return false;

    if (Array.isArray(_allowedRoles)) {
      const res = _allowedRoles.some((allowedRole) => 
        user.roles.includes(allowedRole));
      return res;
    }
    return user.roles === _allowedRoles;
  };

  isAllowedAction = hasRole(allowedRoles);
  return { isAllowedAction }
}