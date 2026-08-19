import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router';
import { Button, Form, Input } from 'antd';
import type { FormProps } from 'antd';
import type { User, UserRequest } from '../../types/admin.types';
import { openNotification } from '@/utils/errors';
import { getUser, editUser } from '../../api/api';
import PermissionGuard from '@/components/PermissionGuard/PermissionGuard';
import { PermissionAction } from '@/constants/permission';
import s from './UserPage.module.scss';


type FieldType = {
  username?: string;
  email?: string;
  phoneNumber?: string;
}; 
// !!! Partial<Pick<User, "username" | "email" | "phoneNumber">>

const UserPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit ] = useState<boolean>(false);

  const { Item } = Form;
  const { id } = useParams();

  const fetchAndSetUser = async (id: number) => {
    try {
      setIsLoading(true);
      const user = await getUser(id);
      if (user) {
        setCurrentUser(user);
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error', 
          title: 'ERROR: Get All Todo', 
          description:`${err.message}`
        })
      }
    } finally {
      setIsLoading(false);
    }
  } 

  useEffect(() => {
    if (id){
      fetchAndSetUser(+id);
    }
  }, []);

  const onFinish: FormProps<FieldType>['onFinish'] = async (values: UserRequest) => {
    const isFormNotChanged = values.username === currentUser?.username 
      && values.email === currentUser?.email
      && values.phoneNumber === currentUser?.phoneNumber;

    if (isFormNotChanged) {
      setIsEdit(false);
      return;
    }
    // let changedValues = {} as Partial<Record<keyof UserRequest, UserRequest[keyof UserRequest]>>;
    let changedValues: UserRequest = {};

    for (const field in values) {
      const key = field as keyof UserRequest;

      if(values[key] !== currentUser?.[key]) {
        changedValues[key] = values[key];
      }
    }

    if(id){
      try{
        const response = await editUser(+id, changedValues);
        setCurrentUser(response ?? null);
        setIsEdit(false);
      } catch(err: unknown) {
        if (err instanceof Error){
          openNotification({
            type: 'error', 
            title: 'ERROR: Admin Edit User', 
            description:`${err.message}`
          })
        }
      }
    }
    
  };


  return (
    <div className={s.userPage}>
      <h1 className={s.h1}>User {id}</h1>
      <section className={s.section}>
        {isLoading && <p>isLoading ...</p>}
        {!isLoading && currentUser && !isEdit && <div className={s.info}>
          <p className={s.fieldName}>Имя:</p><p>{currentUser?.username}</p>
          <p className={s.fieldName}>Email: </p><p>{currentUser?.email}</p>
          <p className={s.fieldName}>Телефон: </p><p>{currentUser?.phoneNumber}</p>
        </div>}
        {!isEdit && <PermissionGuard userAction={PermissionAction.UserEdit}>
          <Button onClick={() => setIsEdit(true)}>
            Редактировать
          </Button>
        </PermissionGuard>}

        {isEdit && <Form
          name="basic"
          initialValues={{ 
            username: currentUser?.username || '',
            email: currentUser?.email || '',
            phoneNumber:currentUser?.phoneNumber || '',
          }}
          layout="horizontal"
          onFinish={onFinish}
        >
          <Item<FieldType>
            label="Имя пользователя"
            name="username"
          >
            <Input />
          </Item>

          <Item<FieldType>
            label="Email"
            name="email"
          >
            <Input />
          </Item>

          <Item<FieldType>
            label="Номер телефона"
            name="phoneNumber"
          >
            <Input />
          </Item>

          <Item label={null}>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
            <Button onClick={() => setIsEdit(false)}>
              Отмена
            </Button>
          </Item>
        </Form>}

        <Link to={'/users'}>
          <Button>Вернуться</Button>
        </Link>
      </section>
    </div>
  )
}

export default UserPage;