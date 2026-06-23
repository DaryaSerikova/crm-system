import { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import type { User } from '@/types/admin.types';
import { getUsers } from '@/api/api';
import { setUsers } from '@/store/slices/adminSlice';
import { useAppDispatch } from '@/store/hooks';
import { getHumanDate } from '@/utils/utils';
import { openNotification } from '@/utils/errors';
import { Link } from 'react-router';
import s from './UsersPage.module.scss';



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
    render: (_, record) => 
      <Link to={`/users/${record.id}`}>
        <Button>Перейти</Button>
      </Link>
  },
];


const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);

  const getAndFetchUsers = async () => {
    try {
      const users = await getUsers();
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



  return (
    <div className={s.usersPage}>
      <h1 className={s.h1}> Пользователи </h1>
      <Table<User> 
        columns={columns} 
        dataSource={currentUsers || []}
        loading={currentUsers === null} 
      />
    </div>
  )
}

export default UsersPage;