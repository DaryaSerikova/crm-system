import type { TodoRequest } from '../../types/types';
import { createTodo } from '../../api/api';
import { getValidationMessage, getValidationMessageAntd } from '../../utils/utils';
import s from './AddTodo.module.scss';

import type { FormProps } from 'antd';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';



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
    console.log('Success:', values);

    const validationMessage: string = getValidationMessage(values.title); //values.title: string | undefined

    if (validationMessage !== '') {
      return;
    }

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
  

  // const handleSubmitTodo = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // const validationMessage: string | null = getValidationMessage(title);
  //   const validationMessage: string = getValidationMessage(title);


  //   // if (validationMessage !== null) {
  //   if (validationMessage !== '') {

  //     setError(validationMessage);
  //     return;
  //   }
  //   setError(null);

  //   try {
  //     const todoRequest: TodoRequest = {
  //       isDone: false,
  //       title: title
  //     }
  
  //     await createTodo(todoRequest);
  //     await onUpdate();
  //     setTitle('');

  //   } catch (err) {
  //     if (err instanceof Error) {
  //       alert(`${err.message}`)
  //     }
  //   }
  // }


  return (
    // <form 
    //   className={s.form}
    //   onSubmit={handleSubmitTodo} 
    //   >
    //   <Input 
    //     // error={error}
    //     // name='title'
    //     value={title}
    //     onChange={(e) => {setTitle(e.target.value)}} 
    //   />
    //   <Button type="submit">Add</Button>
    // </form>


    <Form
        form={form}
        name="add-todo"
        // initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
      <Item<FieldType>
        label=""
        name="title"
        rules={[{ validator: (_, value) => getValidationMessageAntd(value) }]}
      >
        <Input />
      </Item>

    <Item label={null}>
      <Button type="primary" htmlType="submit">
        Add
      </Button>
    </Item>
    </Form>
  )
}

export default AddTodo;