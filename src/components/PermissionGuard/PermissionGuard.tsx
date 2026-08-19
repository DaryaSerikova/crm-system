import React from 'react';
import { usePermission } from '@/utils/hooks/usePermission';
import type { PermissionAction } from '@/constants/permission';

type PermissionGuardProps = {
  userAction: typeof PermissionAction[keyof typeof PermissionAction]
  children: React.ReactNode,
}

const PermissionGuard = ({userAction, children}: PermissionGuardProps) => {
  const { isAllowedAction } = usePermission(userAction);
  if (isAllowedAction) {
    return (<>{children}</>)
  } else {
    return <></>;
  }
}

export default PermissionGuard;