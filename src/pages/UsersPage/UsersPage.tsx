import { useEffect, useState } from 'react';
import { Button, Table,Select } from 'antd';
import type { TableProps } from 'antd';
import type { User, Params, SortBy, SortOrder } from '@/types/admin.types';
import { getUsers } from '@/api/api';
import { setUsers } from '@/store/slices/adminSlice';
import { useAppDispatch } from '@/store/hooks';
import { getHumanDate } from '@/utils/utils';
import { openNotification } from '@/utils/errors';
import { Link } from 'react-router';
import DeleteUserModal from '@/components/DeleteUserModal/DeleteUserModal';
import s from './UsersPage.module.scss';
import { deleteUser } from '@/api/api';



const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [sortBy, setSortBy] = useState<SortBy | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);


  const getAndFetchUsers = async () => {
    try {
      const params: Params = {};
      if (sortBy) {
        params.sortBy = sortBy;
      }
      if (sortOrder) {
        params.sortOrder = sortOrder
      }

      const users = await getUsers(params);

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

  useEffect(() => {
    getAndFetchUsers();
  }, [sortBy, sortOrder]);


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
        <Button onClick={() => setDeletingRecord(record)}>
          Удалить
        </Button>
      </div>
    },
  ];

  const handleSortBy = (value: SortBy) => {
    console.log(`selected ${value}`);
    setSortBy(value);
  };

  const handleSortOrder = (value: SortOrder) => {
    console.log(`selected ${value}`);
    setSortOrder(value);
  }


  return (
    <div className={s.usersPage}>
      <h1 className={s.h1}> Пользователи </h1>
      <Select
        defaultValue="id"
        style={{ width: 200 }}
        onChange={handleSortBy}
        options={[
          { value: 'username', label: 'По имени' },
          { value: 'email', label: 'По email' },
          { value: 'id', label: 'По id' },
        ]}
      />
      <Select
        defaultValue="none"
        style={{ width: 200 }}
        onChange={handleSortOrder}
        options={[
          { value: 'asc', label: 'По возрастанию' },
          { value: 'desc', label: 'По  убыванию' },
          { value: 'none', label: 'По  умолчанию' },
        ]}
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