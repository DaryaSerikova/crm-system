import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import type { User } from '@/types/admin.types';
import { getUsers, deleteUser, blockUser, unblockUser } from '@/api/api';
import { setUsers } from '@/store/slices/adminSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getClearAllValues, getHumanDate } from '@/utils/utils';
import { openNotification } from '@/utils/errors';
import UserFilters from '@/components/UserFilters/UserFilters';
import PermissionGuard from '@/components/PermissionGuard/PermissionGuard';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import { PermissionAction } from '@/constants/permission';
import s from './UsersPage.module.scss';



type HandleBlockUser = {isBlocked: boolean, id: number}

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [qweryParams, setQweryParams] = useState({})
  const user = useAppSelector(state => state.user);
  console.log('USER:', user)

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
      render: (isBlocked, user) => <div>
        {isBlocked ? 'Заблокирован' : 'Незаблокирован'}
        <Button onClick={() => setBlockingUser(user)}>
          {isBlocked ? 'Разблокировать' : 'Заблокировать'}
        </Button>
      </div>,
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
        title={`Подтверждение ${blockingUser?.isBlocked ? 'разблокировки' : 'блокировки'}`}
        okButtonText={`${blockingUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'}`}
        bodyText={`Вы уверены, что хотите 
          ${blockingUser?.isBlocked ? 'разблокировать' : 'заблокировать'} 
          этого пользователя?`}
      />
    </div>
  )
}

export default UsersPage;