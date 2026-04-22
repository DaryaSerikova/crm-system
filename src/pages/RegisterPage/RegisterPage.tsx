import { useState } from 'react';
import { Link } from 'react-router';
import type { FormProps } from 'antd';
import { Form, Input, Button, } from 'antd';
import { PhoneInput } from '@/components/ui/phoneInput';
import { openNotification } from '@/utils/errors';
import { registerUser } from '@/api/api';
import s from './RegisterPage.module.scss';
import skelet from '../../assets/images/skelet.png';



const RegisterPage = () => {
  const [isOpenLink, setIsOpenLink] = useState<boolean>(false);
  const { Item } = Form;
  const { Password } = Input;

  type FieldType = {
    username: string;
    login: string;
    password: string;
    password2: string;
    email: string;
    phone: {
      phone: string;
      prefix?: string;
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const { password2, phone, ...rest } = values;

    const phoneNumber = !!phone?.prefix && !!phone?.phone ? phone.prefix+phone.phone 
    : !!phone?.prefix ? '' 
    : !!phone?.phone ? `+7${phone?.phone}` : '';

    try {
      await registerUser({phoneNumber: phoneNumber, ...rest});

      openNotification({
        type: 'success', 
        title: 'SUCCESS: Register User', 
        description:`УСПЕШНО ЗАРЕГИСТРИРОВАН`
      });
      setIsOpenLink(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error', 
          title: 'ERROR: Register User', 
          description:`${err.message}`
        })
      }
    }

  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={s.register}>
      <div className={s.imageWrapper}>
        <img
          className={s.image}
          src={skelet}
          alt='skelet'
         />
      </div>
      <div className={s.cardWrapper}>
        <div className={s.card}>
          <header className={s.header}>
            {/* <AuthIcon /> */}
            <h1 className={s.h1}>Register to your Account</h1>
            <p className={s.p}>See what is going on with your business</p>
          </header>

          <Form
            className={s.registerForm}
            name="register"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Item<FieldType>
              label="Имя пользователя"
              name="username"
              layout="vertical"
              rules={[
                { required: true, message: 'Обязательное поле' },
                { min: 1, message: 'Cимволов не может быть менее 1' },
                { max: 60, message: 'Cимволов не может быть более 60' },
                { 
                  pattern: /^[a-zA-Zа-яА-ЯёЁ ]+$/, 
                  message: 'Имя может содержать только символы русского/латинского алфавита'
                }
              ]}
              style={{ flex: 1 }}
            >
              <Input className={s.customInput} />
            </Item>
            <Item<FieldType>
              label="Логин"
              name="login"
              layout="vertical"
              rules={[
                { required: true, message: 'Обязательное поле' },
                { min: 2, message: 'Cимволов не может быть менее 2' },
                { max: 60, message: 'Cимволов не может быть более 60' },
                { 
                  pattern: /^[a-zA-Z ]+$/, 
                  message: 'Логин может содержать только символы латинского алфавита'
                }
              ]}
              style={{ flex: 1 }}
            >
              <Input className={s.customInput} />
            </Item>
            <Item<FieldType>
              label="Пароль"
              name="password"
              layout="vertical"
              rules={[
                { required: true, message: 'Обязательное поле' },
                { min: 6, message: 'Cимволов не может быть менее 6' },
                { max: 60, message: 'Cимволов не может быть более 60' },
              ]}
              style={{ flex: 1 }}
            >
              <Password className={s.customInput} />
            </Item>
            <Item<FieldType>
              label="Повторите пароль"
              name="password2"
              layout="vertical"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Поле не может быть пустым!!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Пароли не совпадают!'));
                  },
                }),
              ]}
              style={{ flex: 1 }}
            >
              <Password className={s.customInput} />
            </Item>
            <Item<FieldType>
              label="Почтовый адрес"
              name="email"
              layout="vertical"
              rules={[
                { required: true, message: 'Обязательное поле' },
                { 
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                  message: 'Невалидный email'
                }
              ]}
              style={{ flex: 1 }}
            >
              <Input className={s.customInput} />
            </Item>
            <Item<FieldType>
                layout="vertical"
                label="Телефон"
                name="phone"
                style={{flex: 1}}
              >
              <PhoneInput />
              </Item>
            <Button 
              type="primary" 
              className={s.customButton} 
              htmlType="submit"
            >
              Register
            </Button>
          </Form>
          { isOpenLink 
            ? <Link to={"/login"}>
                Перейти на страницу авторизации для входа в систему
              </Link>
            : <></>}

        </div>
      </div>
    </div>
  )
}

export default RegisterPage;
