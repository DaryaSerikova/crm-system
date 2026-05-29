import type { AuthData } from '@/types/user.types';
import type { FormProps } from 'antd';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from "react-router";
import { openNotification } from '@/utils/errors';
import { loginUser } from '@/api/api';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import AuthIcon from '@/assets/icons/AuthIcon';
import s from "./LoginPage.module.scss";



const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { Item } = Form;
  const { Password } = Input;


  type FieldType = {
    login: string;
    password: string;
    // rememberMe?: boolean;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = async (values: AuthData) => {

    try {
      const token = await loginUser(values);
      dispatch(setAuth({
        accessToken: token?.accessToken
      }))

      navigate('/');
      openNotification({
        type: 'success',
        title: 'SUCCESS', 
        description: `Login is success`, 
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        openNotification({
          type: 'error',
          title: 'ERROR', 
          description: `Login is failed: ${err.message}`, 
        });
      }
    }
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={s.login}>
      <div className={s.card}>
        <header className={s.header}>
          <AuthIcon />
          <h1 className={s.h1}>Login to your Account</h1>
          <p className={s.p}>See what is going on with your business</p>
        </header>
        <Form
          className={s.loginForm}
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            login: "",
            password: "",
          }}
        >
          <Item<FieldType>
            label="Login"
            name="login"
            layout="vertical"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Обязательное поле' },
            ]}
          >
            <Input className={s.customInput}
            />
          </Item>
          <Item<FieldType>
            label="Password"
            name="password"
            layout="vertical"
            style={{ flex: 1 }}
            rules={[
              { required: true, message: 'Обязательное поле' },
            ]}
          >
            <Password className={s.customInput} />
          </Item>

          {/* <Item<FieldType>
            layout="horizontal"
            name="rememberMe"
            valuePropName="checked"
          >
            <Flex justify="space-between" align="center" style={{ width: '100%' }}>
              <Checkbox>Remember me</Checkbox>
              <Link to="#">Forgot Password?</Link>
            </Flex>
          </Item> */}
          <Button 
            type='primary'
            className={s.customButton}
            htmlType='submit'
          >
            Login
          </Button>
        </Form>
      </div>

      <div className={s.registerLink}>
        <p className={s.text}>Not Registered Yet?</p>
        <Link to='/register' className={s.link}>
          Create an account
        </Link>
      </div>
    </div>
  )
}

export default LoginPage;