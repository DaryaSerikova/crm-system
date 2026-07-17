import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import type { User } from '@/types/admin.types';
import { getUsers, deleteUser } from '@/api/api';
import { setUsers } from '@/store/slices/adminSlice';
import { useAppDispatch } from '@/store/hooks';
import { getClearAllValues, getHumanDate } from '@/utils/utils';
import { openNotification } from '@/utils/errors';
import DeleteUserModal from '@/components/DeleteUserModal/DeleteUserModal';
import UserFilters from '@/components/UserFilters/UserFilters';
import s from './UsersPage.module.scss';
import PermissionGuard from '@/components/PermissionGuard/PermissionGuard';
import { PermissionAction } from '@/constants/permission';



const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);
  const [deletingRecord, setDeletingRecord] = useState(null);

  const abortControllerRef = useRef<AbortController | null>(null);


  const getAndFetchUsers = async (params = {}) => { //!!!подумать params {} или undefined null
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

  useEffect(() => {
    getAndFetchUsers();
  }, []);


  const handleDelete = async (record: User | null) => {
    if (record !== null) {
      const {id} = record;
      setDeletingRecord(null);
  
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

  const columns: TableProps<User>['columns'] = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      key: 'username',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'date',
      key: 'date',
      render: (dateString) => <>{getHumanDate(dateString)}</>,
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (isBlocked) => <a>{isBlocked ? 'Заблокирован' : 'Незаблокирован'}</a>,
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      render: (roles) => roles.length > 1 
        ? <div>{roles.join(', ')}</div> 
        : <div>{roles}</div>,
    },
    {
      title: '',
      dataIndex: 'other',
      key: 'other',
      render: (_, record ) => <div>
        <Link to={`/users/${record.id}`}>
          <Button>Перейти</Button>
        </Link>
        <PermissionGuard userAction={PermissionAction.UserDelete}>
          <Button onClick={() => setDeletingRecord(record)}>
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
        getAndFetchUsers={getAndFetchUsers} 
      />
      <Table<User> 
        columns={columns} 
        dataSource={currentUsers || []}
        loading={currentUsers === null} 
      />
      <DeleteUserModal 
        isOpen={Boolean(deletingRecord)}
        record={deletingRecord}
        onClose={() => setDeletingRecord(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default UsersPage;