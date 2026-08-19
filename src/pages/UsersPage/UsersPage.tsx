import { useEffect, useState, useRef, useMemo } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { Button, Table } from 'antd';
import type { TableProps, TablePaginationConfig } from 'antd';
import type { FilterValue, SorterResult, SortOrder, Key } from 'antd/es/table/interface';
import type { Params, RolesValues, User } from '@/types/admin.types';
import { setUsers } from '@/store/slices/adminSlice';
import { useAppDispatch } from '@/store/hooks';
import UserFilters from '@/components/UserFilters/UserFilters';
import PermissionGuard from '@/components/PermissionGuard/PermissionGuard';
import ConfirmModal from '@/components/ConfirmModal/ConfirmModal';
import UserRoles from '@/components/UserRoles/UserRoles';
import { getUsers, deleteUser, blockUser, unblockUser, changeUserRoles } from '@/api/api';
import { getClearAllValues, getHumanDate, getHumanPhone, deleteIdFromRoles } from '@/utils/utils';
import { openNotification } from '@/utils/errors';
import { PermissionAction } from '@/constants/permission';
import PhoneIcon from '@/assets/icons/PhoneIcon';
import s from './UsersPage.module.scss';


type SortParams = {
  field: Key | readonly Key[] | undefined;
  order: SortOrder | undefined;
}

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [blockingUser, setBlockingUser] = useState<User | null>(null);
  const [qweryParams, setQweryParams] = useState<Params>({});
  const [sortParams, setSortParams] = useState<SortParams>({field: undefined, order: undefined});

  const [rolesValue, setRolesValue] = useState<RolesValues[]>([]);
  const [rolesUser, setRolesUser] = useState<User | null>(null);
  const [currentRolesFormIds, setCurrentRolesFormIds] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const PAGE_SIZE = 20; 

  const abortControllerRef = useRef<AbortController | null>(null);



  const setAndFetchUsers = async (params = {}) => {
    setLoading(true);

    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const clearParams: Params = getClearAllValues(params) ?? {};
      const usersInfo = await getUsers(clearParams, controller);

      if (usersInfo) {
        dispatch(setUsers(usersInfo.data)); //!!! (в setData то же самое ниже)
        setQweryParams(params);
        setCurrentUsers(usersInfo.data); //setData это  
        setTotalUsers(usersInfo.meta.totalAmount);   
      }

    } catch(err: unknown) {
      if (err instanceof Error) { //!!!
        // console.log('setAndFetchUsers | axios.isCancel(err): ', axios.isCancel(err))
        if (axios.isCancel(err) || err?.name === 'CanceledError') { //отмена нотификации при отмене запроса
          return; 
        }
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
    setAndFetchUsers();
  }, []);

  useEffect(() => {
    setAndFetchUsers({
      ...qweryParams, 
      page: currentPage, 
      limit: PAGE_SIZE
    }); 
  }, [currentPage, sortParams]);


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

  const handleDelete = async (user: User | null) => {
    if (user !== null) {
      const {id} = user;
      setDeletingUser(null);
  
      try {
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
  const handleBlockUser = async (user: User | null) => {
    if (user) {
      const {isBlocked, id} = user;
      if (isBlocked) {
        await postUnblockUser(id);
        await setAndFetchUsers(qweryParams);
        setBlockingUser(null);
      } else {
        await postBlockUser(id);
        await setAndFetchUsers(qweryParams);
        setBlockingUser(null);
      }
    }
  }
  
  const handleChangeRoles = async (user: User | null, newRoles: RolesValues[]) => {    
    if (user) {
      try {
        await changeUserRoles(user.id, newRoles);
        await setAndFetchUsers(qweryParams);
        setRolesValue([]);

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
      } finally {
        deleteIdFromRoles(user, currentRolesFormIds, setCurrentRolesFormIds);
      }
    }
  }

  const columns: TableProps<User>['columns'] = useMemo(() => [
    {
      title: 'Имя',
      dataIndex: 'username',
      key: 'username',
      sorter: true, // Включает сортировку на бэкенде для этой колонки
      sortOrder: sortParams.field === 'username' ? sortParams.order : undefined, // Управляет подсветкой стрелочек
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: true, 
      sortOrder: sortParams.field === 'email' ? sortParams.order : undefined,
      render: (email) => <div className={s.email}>
        {email}</div>,
    },
    {
      title: 'Дата регистрации',
      dataIndex: 'date',
      key: 'date',
      width: 118,
      render: (dateString) => <>{getHumanDate(dateString)}</>,
    },
    {
      title: 'Статус блокировки',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      width: 185,
      render: (isBlocked, user) => <div className={s.block}>
        {isBlocked ? 'Заблокирован' : 'Незаблокирован'}
        <PermissionGuard userAction={PermissionAction.UserBlock}>
          <Button onClick={() => setBlockingUser(user)}>
            {/* {isBlocked ? 'Разблокировать' : 'Заблокировать'} */}
            {isBlocked ? '+' : '-'}

          </Button>
        </PermissionGuard>
      </div>,
    },
    {
      title: 'Роли',
      dataIndex: 'roles',
      key: 'roles',
      width: 160,
      render: (roles, user) => (
        <UserRoles 
          roles={roles}
          user={user}
          currentRolesFormIds={currentRolesFormIds}
          setRolesValue={setRolesValue} 
          setRolesUser={setRolesUser}
          setCurrentRolesFormIds={setCurrentRolesFormIds}
        />)
    },
    {
      title: 'Телефон',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 180,
      render: (phone) => (
        <div className={s.phone}>
          {phone && <PhoneIcon/>}{getHumanPhone(phone)}
        </div>),
    },
    {
      title: '',
      dataIndex: 'other',
      key: 'other',
      width: 130,
      render: (_, record ) => <div>
        <Link to={`/users/${record.id}`}>
          <Button>Профиль</Button>
        </Link>
        <PermissionGuard userAction={PermissionAction.UserDelete}>
          <Button onClick={() => setDeletingUser(record)}>
            Удалить
          </Button>
        </PermissionGuard>
      </div>
    },
  ], [sortParams.field, sortParams.order, currentRolesFormIds]);

  // Функция срабатывает при клике на номера страниц внизу таблицы
  const handleTableChange = (...args: [
    TablePaginationConfig,
    Record<string, FilterValue | null>,
    SorterResult<User> | SorterResult<User>[],
    { action: 'paginate' | 'sort' | 'filter'; currentDataSource: User[] }
  ]) => {
    const [pagination, , sorter] = args; //pagination, filters, sorter, служебный объект

    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
    
    const isMultipleSorter = Array.isArray(sorter);

    if (!isMultipleSorter) { //нет сортировки 2-3 колонок одновременно
      
      const getRightFormOrder = (order: SortOrder | undefined) => {
      // const getRightFormOrder = (order: 'ascend' | 'descend' | undefined) => {

        if (order === 'ascend') {
          return 'asc';
        } 
        if (order === 'descend') {
          return 'desc';
        }
        return undefined;
      }


      setSortParams({
        field: sorter.field,
        order: sorter.order
      });
  
      setQweryParams({...qweryParams, 
        sortBy: sorter.field as Params['sortBy'] ?? 'id', 
        sortOrder: getRightFormOrder(sorter.order),
      })
    }
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
        tableLayout="fixed"

        //пагинация
        onChange={handleTableChange} // Срабатывает при клике на номера страниц
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: PAGE_SIZE,
          total: totalUsers,
          showSizeChanger: false,   // Скрывает динамический выбор (10, 20, 50)
        }} 
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
        onConfirm={() => handleBlockUser(blockingUser)}
        title={`Подтверждение ${blockingUser?.isBlocked ? 'разблокировки' : 'блокировки'}`}
        okButtonText={`${blockingUser?.isBlocked ? 'Разблокировать' : 'Заблокировать'}`}
        bodyText={`Вы уверены, что хотите 
          ${blockingUser?.isBlocked ? 'разблокировать' : 'заблокировать'} 
          этого пользователя?`}
      />
      <ConfirmModal 
        isOpen={Boolean(Array.isArray(rolesValue) && rolesValue.length !== 0)}
        user={rolesUser}
        onClose={() => {
          setRolesValue([]);
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