import React, { type SetStateAction } from 'react';
import { Form, Select, Button, Tag } from 'antd';
import { usePermission } from '@/utils/hooks/usePermission';
import { PermissionAction } from '@/constants/permission';
import type { RolesValues, User } from '@/types/admin.types';
import { Roles } from '@/types/admin.types';
import { deleteIdFromRoles } from '@/utils/utils';


type TagRender = SelectProps['tagRender'];

const roleColors = {
  user: 'purple',
  admin: 'blue',
  moderator: 'orange',
}
  
const tagRender: TagRender = (props) => {
  const { label, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={roleColors[label.toLowerCase()]}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      {label}
    </Tag>
  );
};

interface UserRolesProps {
  user: User,
  roles: RolesValues,
  currentRolesFormIds: number[],
  setCurrentRolesFormIds: React.Dispatch<SetStateAction<number[]>>,
  setRolesValue: React.Dispatch<SetStateAction<RolesValues | null>>,
  setRolesUser: React.Dispatch<SetStateAction<User | null>>,
}


const UserRoles = ({
  user, 
  roles, 
  currentRolesFormIds, 
  setCurrentRolesFormIds,
  setRolesValue, 
  setRolesUser,
}: UserRolesProps) => {
  const {isAllowedAction: isAllowedRoles} = usePermission(PermissionAction.UserRoles);

  const rolesOptions = Object.values(Roles).map(
    (item) => ({value: item, label: item})
  );

  const isOpenRolesForm = currentRolesFormIds.includes(user.id);
  return (isAllowedRoles && isOpenRolesForm
  ? <Form
      key={user.id}
      preserve={false}
      // initialValues={{ roles: rolesValue ?? roles }} 
      initialValues={{roles: roles}}
      onFinish={(values) => {
        setRolesValue(values.roles);
        setRolesUser(user);
      }}
    >
      <Form.Item label='' name="roles">
        <Select 
          mode="multiple"
          options={rolesOptions}
          style={{ width: '150px' }}
          tagRender={tagRender}                        
        />
      </Form.Item>
      <Button htmlType="submit">Сохранить</Button>
      <Button onClick={() => 
        deleteIdFromRoles(user, currentRolesFormIds, setCurrentRolesFormIds)}
      >Отмена</Button>
    </Form>
  : <>
  {roles.map((role: RolesValues) => 
    <Tag 
      key={role} 
      color={roleColors[role.toLowerCase()]} 
      variant='solid'
    >
      {role}
    </Tag>
  )}
  <Button onClick={() => 
    setCurrentRolesFormIds([
      ...currentRolesFormIds, 
      user.id
    ])}
  >Изменить</Button>
  </>)
}

export default UserRoles;