import type { TodoRequest } from '../../types/todo.types';
import { Button, Form, Input, Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { FormProps } from 'antd';
import { createTodo } from '../../api/api';
import { openNotification } from '@/utils/errors';



interface AddTodoProps {
  onUpdate: () => Promise<void>,
}

const AddTodo = ({ onUpdate }: AddTodoProps) => {
  const { Item } = Form;
  const [ form ] = useForm();

  type FieldType = {
    title?: string;
  };
  
  const onFinish: FormProps<FieldType>['onFinish'] = async(values) => {
    try {
      const todoRequest: TodoRequest = {
        isDone: false,
        title: values.title,
      }
  
      await createTodo(todoRequest);
      await onUpdate();
      form.resetFields(); 

    } catch (err) {
      if (err instanceof Error) {
        openNotification({
          type: 'error', 
          title: 'ERROR: Add Todo', 
          description:`${err.message}`
        })
      }
    }
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('onFinishFailed Failed:', errorInfo);
  };
  
  return (
    <Form
      form={form}
      name="add-todo"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Flex gap={10} align="center">
        <Item<FieldType>
          label=""
          name="title"
          rules={[
            { required: true, message: 'Поле не может быть пустым!!' },
            { min: 2, message: 'Cимволов не может быть менее 2' },
            { max: 64, message: 'Cимволов не может быть более 64' }
          ]}
          style={{ flex: 1 }}
        >
          <Input />
        </Item>

        <Item label={null} >
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Item>
      </Flex>

    </Form>
  )
}

export default AddTodo;