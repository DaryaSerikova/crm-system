import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import type { Params, RolesValues, User } from '@/types/admin.types';
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
import { usePermission } from '@/utils/hooks/usePermission';




const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [qweryParams, setQweryParams] = useState<Params>({});

  const [rolesValue, setRolesValue] = useState<RolesValues | null>(null);
  const [rolesUser, setRolesUser] = useState<User | null>(null);


  const [loading, setLoading] = useState<boolean>(false);
  const [totalUsers, setTotalUsers] = useState<number>(0); // Общее количество записей в базе данных
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 20; 


  const {isAllowedAction: isAllowedRoles} = usePermission(PermissionAction.UserRoles);

  const user = useAppSelector(state => state.user);
  useEffect(() => {
    console.log('USER:', user)
  }, [])

  const abortControllerRef = useRef<AbortController | null>(null);

  const setAndFetchUsers = async (params = {}) => { //!!!подумать params {} или undefined 
    // !!! не передан page
    setLoading(true);

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const clearParams = getClearAllValues(params);
      const users = await getUsers(clearParams, controller); //!!!

      console.log('users: ', users);
      dispatch(setUsers(users.data)); //!!! (в setData то же самое ниже)
      setQweryParams(params);
      setCurrentUsers(users.data); //setData это

      // setData(users.data);         // !!! (в диспатче то же самое выше) Записываем массив данных
      setTotalUsers(users.meta.totalAmount);   // Важно: бэкенд должен возвращать общее количество строк в БД
    } catch(err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR',
          description: 'Admin Users are failed'
        })
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setAndFetchUsers({...qweryParams, page: currentPage, limit: PAGE_SIZE}); 
  }, [currentPage]);

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

  const handleDelete = async (user: User | null) => {
    if (user !== null) {
      const {id} = user;
      setDeletingUser(null);
  
      try {
        console.log('delete')
        await deleteUser(id);
        await setAndFetchUsers(qweryParams);
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
  const handleBlockUser = async (user: User | null) => { //!!! сломалось обновление? нет, не блокируется
    if (user) {
      const {isBlocked, id} = user;
      if (isBlocked) { //isBlocked === true заблокирован, надо разбловировать
        console.log('UNBLOCK');
        await postUnblockUser(id);
        await setAndFetchUsers(qweryParams);
      } else {
        console.log('BLOCK')
        await postBlockUser(id);
        console.log('block qweryParams: ', qweryParams);
        await setAndFetchUsers(qweryParams);
        setBlockingUser(null);
      }
    }
  }

  const rolesOptions = Object.values(Roles).map(
    (item) => ({value: item, label: item})
  );
  
  const handleChangeRoles = async (user: User | null, newRoles: RolesValues | null) => {
    console.log('value newRoles: ', newRoles); //newRoles //value
    
    if (user) { //!!! ???
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
        return (isAllowedRoles 
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
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 145,
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

  // Функция срабатывает при клике на номера страниц внизу таблицы
  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  return (
    <div className={s.usersPage}>
      <h1 className={s.h1}> Пользователи </h1>
      <UserFilters 
        setAndFetchUsers={setAndFetchUsers} 
      />
      <Table<User> 
        columns={columns} 
        dataSource={currentUsers || []}
        // loading={currentUsers === null} 
        tableLayout="fixed"

        //пагинация
        // rowKey="id" // Укажите ваш уникальный ключ для строк
        onChange={handleTableChange} // Срабатывает при клике на номера страниц
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,      //по 20 строк
          total: totalUsers,        //всего юзеров
          showSizeChanger: false,   // Скрывает динамический выбор (10, 20, 50)
        }} 
      />
      {/* !!! Можно унифицировать количество передаваемых параметров ? */}
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
        onConfirm={() => handleBlockUser(blockingUser)}
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