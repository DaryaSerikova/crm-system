import { useState, useEffect } from 'react'
import { useParams } from 'react-router';
import { getUser } from '../../api/api';
import type { User } from '../../types/admin.types';
import { openNotification } from '@/utils/errors';
import { Link } from 'react-router';
import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { editUser } from '../../api/api';
import s from './UserPage.module.scss';

type FieldType = {
  username?: string;
  email?: string;
  phoneNumber: string;
};


const UserPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit ] = useState<boolean>(false);

const { Item } = Form;
  const { id } = useParams();
  console.log('id: ', id);


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

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

    if (values.username === currentUser?.username 
      && values.email === currentUser?.email
      && values.phoneNumber === currentUser?.phoneNumber) {
      setIsEdit(false);
      return;
    }

    if(id){
      try{
        const response = await editUser(+id, values);
        console.log('res edit: ', response);
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
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  return (
    <div className={s.userPage}>
      <h1 className={s.h1}>User {id}</h1>
      <section className={s.section}>
        {isLoading && <p>isLoading ...</p>}
        {!isLoading && currentUser && !isEdit && <>
          <p>{currentUser?.username}</p>
          <p>{currentUser?.email}</p>
          <p>{currentUser?.phoneNumber}</p>
        </>}
        {!isEdit && <Button onClick={() => setIsEdit(true)}>
          Редактировать
        </Button>}

        {isEdit && <Form
          name="basic"
          initialValues={{ 
            username: currentUser?.username || '',
            email: currentUser?.email || '',
            phoneNumber:currentUser?.phoneNumber || '',
          }}
          layout="horizontal"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
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
          <Button>К таблице пользователей</Button>
        </Link>
      </section>
    </div>
  )
}

export default UserPage;