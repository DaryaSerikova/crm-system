import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import type { User } from '@/types/admin.types';
import { Roles } from '@/types/admin.types';
import { getUsers, deleteUser, blockUser, unblockUser, changeUserRoles } from '@/api/api';
import { setUsers } from '@/store/slices/adminSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getClearAllValues, getHumanDate } from '@/utils/utils';
import { openNotification } from '@/utils/errors';
import UserFilters from '@/components/UserFilters/UserFilters';
import PermissionGuard from '@/components/PermissionGuard/PermissionGuard';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import { PermissionAction } from '@/constants/permission';
import s from './UsersPage.module.scss';
import { Select, Form } from 'antd';



type HandleBlockUser = {isBlocked: boolean, id: number}

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [qweryParams, setQweryParams] = useState({})

  const [rolesValue, setRolesValue] = useState(null);
  const [rolesUser, setRolesUser] = useState(null);

  const user = useAppSelector(state => state.user);
  useEffect(() => {
    console.log('USER:', user)
  }, [])

  const abortControllerRef = useRef<AbortController | null>(null);

  const setAndFetchUsers = async (params = {}) => { //!!!подумать params {} или undefined null
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const clearParams = getClearAllValues(params);
      const users = await getUsers(clearParams, controller); //!!!

      console.log('users: ', users);
      dispatch(setUsers(users.data));
      setQweryParams(params);
      setCurrentUsers(users.data);
    } catch(err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR',
          description: 'Admin Users are failed'
        })
      }
    }
  }
  const postBlockUser = async (id: number) => {
    try {
      await blockUser(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR',
          description: `Blocking user ${id} are failed`
        })
      }
    }
  }
  const postUnblockUser = async (id: number) => {
    try {
      await unblockUser(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR',
          description: 'Unblocking user ${id} are failed'
        })
      }
    }
  }

  useEffect(() => {
    setAndFetchUsers();
  }, []);


  const handleDelete = async (record: User | null) => {
    if (record !== null) {
      const {id} = record;
      setDeletingUser(null);
  
      try {
        console.log('delete')
        await deleteUser(id);
        openNotification({
          type: 'success',
          title: 'SUCCESS',
          description: `Admin: user ${id} is deleted` 
        })
      } catch (err: unknown) {
        if (err instanceof Error) {
          openNotification({
            type: 'error',
            title: 'ERROR',
            description: `Admin: user ${id} is not deleted` 
          })
        }
      }
    }
  };
  const handleBlockUser = async ({isBlocked, id}: HandleBlockUser) => {
    if (isBlocked) {
      console.log('UNBLOCK');
      await postUnblockUser(id);
      await setAndFetchUsers(qweryParams);
    } else {
      console.log('BLOCK')
      await postBlockUser(id);
      await setAndFetchUsers(qweryParams);
      setBlockingUser(null);
    }
  }

  const isAdmin = true;
  const rolesOptions = Object.values(Roles).map(
    (item) => ({value: item, label: item})
  );
  
  const handleChangeRoles = async (user, newRoles) => { // !!! типизировать
    console.log('value newRoles: ', newRoles); //newRoles //value
    
    try {
      await changeUserRoles(user.id, newRoles); 
      await setAndFetchUsers(qweryParams);
      setRolesValue(null);

      openNotification({
        type: 'success',
        title: 'SUCCESS',
        description: `Admin: user ${user.id} rights (roles) were changed` 
      })
    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR',
          description: `Admin: user ${user.id} rights (roles) were not changed` 
        })
      }
    }
  }

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
      // width: 110,
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      // width: 150,
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (dateString) => <>{getHumanDate(dateString)}</>,
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      width: 190,
      render: (isBlocked, user) => <div>
        {isBlocked ? 'Заблокирован' : 'Незаблокирован'}
        <PermissionGuard userAction={PermissionAction.UserBlock}>
          <Button onClick={() => setBlockingUser(user)}>
            {isBlocked ? 'Разблокировать' : 'Заблокировать'}
          </Button>
        </PermissionGuard>
      </div>,
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      width: 160,
      render: (roles, user) => {
        return (isAdmin 
        ? <Form>
            <Select 
              mode="multiple"
              options={rolesOptions}
              style={{ width: '150px' }}
              // defaultValue={[...roles]}
              value={rolesValue ?? roles}
              onChange={(value) => {
                setRolesValue(value);
                setRolesUser(user);
              }}                          
            />
          </Form>
        : roles.length > 1 ? <div>{roles.join(', ')}</div> : <div>{roles}</div>)
      },
        
    },
    {
      title: '',
      dataIndex: 'other',
      key: 'other',
      width: 130,
      render: (_, record ) => <div>
        <Link to={`/users/${record.id}`}>
          <Button>Перейти</Button>
        </Link>
        <PermissionGuard userAction={PermissionAction.UserDelete}>
          <Button onClick={() => setDeletingUser(record)}>
            Удалить
          </Button>
        </PermissionGuard>
      </div>
    },
  ];

  return (
    <div className={s.usersPage}>
      <h1 className={s.h1}> Пользователи </h1>
      <UserFilters 
        setAndFetchUsers={setAndFetchUsers} 
      />
      <Table<User> 
        columns={columns} 
        dataSource={currentUsers || []}
        loading={currentUsers === null} 
        tableLayout="fixed"
      />
      <ConfirmModal 
        isOpen={Boolean(deletingUser)}
        user={deletingUser}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDelete}
        title="Подтверждение удаления"
        okButtonText="Удалить"
        bodyText="Вы уверены, что хотите удалить этого пользователя?"
      />
      <ConfirmModal 
        isOpen={Boolean(blockingUser)}
        user={blockingUser}
        onClose={() => setBlockingUser(null)}
        onConfirm={() => handleBlockUser({
          isBlocked: blockingUser?.isBlocked, 
          id: blockingUser?.id
        })}
        //!!! onConfirm тоже проблема с аргументами
        title={`Подтверждение ${blockingUser?.isBlocked ? 'разблокировки' : 'блокировки'}`}
        okButtonText={`${blockingUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'}`}
        bodyText={`Вы уверены, что хотите 
          ${blockingUser?.isBlocked ? 'разблокировать' : 'заблокировать'} 
          этого пользователя?`}
      />
      <ConfirmModal 
        isOpen={Boolean(rolesValue)}
        user={rolesUser}
        onClose={() => {
          setRolesValue(null);
          setRolesUser(null);
        }}
        onConfirm={() => handleChangeRoles(rolesUser, rolesValue)}
        title="Подтверждение изменения прав пользователя"
        okButtonText="Изменить права"
        bodyText="Вы уверены, что хотите изменить права этого пользователя?"
      />
    </div>
  )
}

export default UsersPage;