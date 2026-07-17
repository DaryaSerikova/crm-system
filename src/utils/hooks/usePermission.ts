import { useAppSelector } from "@/store/hooks";
import type { RolesValues, PermissionActionValues } from "@/types/admin.types";
import { PERMISSIONS_MAP } from "@/constants/permission";

export const usePermission = (userAction = 'user.view') => {
  const user = useAppSelector((state) => state.user); 
  console.log('roles: ', user.roles); //roles конкретного пользователя
console.log('userAction: ', userAction)

  const allowedRoles = PERMISSIONS_MAP[userAction as PermissionActionValues];
  console.log('allowedRoles: ', allowedRoles);

  console.log('user: ', user)

  let isAllowedAction = null;

  if(user.roles === null) return { isAllowedAction: false };

  // const hasRole = (role: Roles | Roles[]): boolean => {
  // const hasRole = (_allowedRoles: Roles | Roles[]): boolean => {
  const hasRole = (_allowedRoles: RolesValues | RolesValues[]): boolean => {

    console.log('allowedRoles: ', _allowedRoles);
    console.log('user.roles: ', user.roles)

    if (!user) return false;

    if (Array.isArray(_allowedRoles)) {
      // let isHasRole: boolean | null = null;

      const res = _allowedRoles.some((allowedRole) => 
        user.roles.includes(allowedRole));

      // console.log('_allowedRoles.includes(user.roles) ', _allowedRoles.includes(user.roles))
      console.log('isHasRole: ', res)
      return res;
    }
    return user.roles === _allowedRoles;
  };

  isAllowedAction = hasRole(allowedRoles);
  console.log('isAllowedAction', isAllowedAction)


  return { isAllowedAction }

}