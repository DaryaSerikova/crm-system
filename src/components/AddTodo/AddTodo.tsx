import type { TodoRequest } from '../../types/types';
import { Button, Form, Input, Flex } from 'antd';
import { useForm } from 'antd/es/form/Form';
import type { FormProps } from 'antd';
import { createTodo } from '../../api/api';
import { getValidationMessageAntd } from '../../utils/utils';



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
        alert(`${err.message}`)
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
          rules={[{ validator: (_, value) => getValidationMessageAntd(value) }]}
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