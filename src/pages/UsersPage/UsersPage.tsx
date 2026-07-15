import { useEffect, useState, useRef } from 'react';
import { Button, Table,Select, Input, Form, Row, Col } from 'antd';
import type { TableProps } from 'antd';
import type { User, Params } from '@/types/admin.types';
import { getUsers } from '@/api/api';
import { setUsers } from '@/store/slices/adminSlice';
import { useAppDispatch } from '@/store/hooks';
import { getClearAllValues, getHumanDate } from '@/utils/utils';
import { openNotification } from '@/utils/errors';
import { Link } from 'react-router';
import DeleteUserModal from '@/components/DeleteUserModal/DeleteUserModal';
import s from './UsersPage.module.scss';
import { deleteUser } from '@/api/api';
import { useDebounceCallback } from '@/utils/useDebounceCallback';


type FieldType = {
  sortBy?: string;
  sortOrder?: string;
  search?: string;
};

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const [currentUsers, setCurrentUsers] = useState<User[] | null>(null);
  const [deletingRecord, setDeletingRecord] = useState(null);

  const { Item } = Form;
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
        <Button onClick={() => setDeletingRecord(record)}>
          Удалить
        </Button>
      </div>
    },
  ];

  const debouncedGetAndFetchUsers = useDebounceCallback(getAndFetchUsers, 400);

  const handleValuesChange = (changedValues: Params, allValues: Params) => {
    console.log('changedValues: ', changedValues);
    console.log('allValues: ', allValues)

    if ('search' in changedValues) { //только для инпута debounce
      debouncedGetAndFetchUsers(allValues);
    } else {
      getAndFetchUsers();
    }
  }

  return (
    <div className={s.usersPage}>
      <h1 className={s.h1}> Пользователи </h1>
      <div className={s.userFilters}>
        <Form
          name="basic"
          initialValues={{ 
            // sortBy?: null;
            // sortOrder?: null;
            // search?: '';
          }}
          layout="vertical"
          onValuesChange={handleValuesChange}
        >
          <Row gutter={[16, 16]} align="bottom">
            <Col xs={24} sm={12}>
              <Item<FieldType>
                label="Cортировка по имени/email/id"
                name="sortBy"
              >
                <Select
                  defaultValue="id"
                  // style={{ width: 200 }}
                  // onChange={handleSortBy}
                  options={[
                    { value: 'username', label: 'По имени' },
                    { value: 'email', label: 'По email' },
                    { value: 'id', label: 'По id' },
                  ]}
                />
              </Item>
            </Col>
            <Col xs={24} sm={12}>
              <Item<FieldType>
                label="Cортировка по порядку"
                name="sortOrder"
              >
                <Select
                  defaultValue="none"
                  // style={{ width: 200 }}
                  // onChange={handleSortOrder}
                  options={[
                    { value: 'asc', label: 'По возрастанию' },
                    { value: 'desc', label: 'По  убыванию' },
                    { value: 'none', label: 'По  умолчанию' },
                  ]}
                />
              </Item>
            </Col>
          </Row>

          <Item name="search" label="Поиск">
            <Input 
              // value={search} 
              // onChange={handleSearch}
            />
          </Item>
        </Form>
      </div>
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