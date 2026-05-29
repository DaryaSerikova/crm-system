import { useEffect, useState } from 'react';
import type { Todo, Filter, TodoRequest } from '../../types/todo.types';
import type { FormProps } from 'antd';
import type { CheckboxProps } from 'antd';
import { Button, Checkbox, Form, Input, Row, Col, Space, Flex } from 'antd';
import { deleteTodo, editTodo } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import { openNotification } from '@/utils/errors';
import s from './TodoItem.module.scss'



interface TodoProps {
  todo: Todo,
  listFilter: Filter,
  onUpdate: () => Promise<void>,
}

type FieldType = {
  isDone?: boolean;
  title?: string;
};

const TodoItem = ({ todo, listFilter, onUpdate }: TodoProps) => {

  const { id, title, isDone } = todo;
  const [ isEdit, setIsEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(title); //нужен!!!!!! 
  const [ editIsDone, setEditIsDone ] = useState<boolean>(isDone); //добавленное

  const { Item } = Form;
  const [form] = Form.useForm();

  useEffect(() => {
    const initialData = {isDone: isDone, title: title};
    form.setFieldsValue(initialData);
  }, [form, isDone, title]);
  

  const handleSubmitEditedTodo: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('submit values:', values);
    const validationMessage: string = getValidationMessage(editTitle);

    if (validationMessage !== '') {
      return;
    }

    try {
      const todoRequest: TodoRequest = {
        isDone: editIsDone,
        title: editTitle,
      }

      await editTodo(id, todoRequest);
      setIsEdit(false);
      await onUpdate();

    } catch (err) {
      if (err instanceof Error) {
        openNotification({
          type: 'error', 
          title: 'ERROR: Edit Todo', 
          description:`${err.message}`
        })
      }
    }
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo); //handleSubmitEditedTodo
  };

  const onChangeEditCheckbox: CheckboxProps['onChange'] = (e) => { //checkbox
    setEditIsDone(e.target.checked);
  };


  const handleCancel = () => {
    setEditTitle(title); 
    setEditIsDone(isDone);  //добавленное
    setIsEdit(false);
    form.setFieldsValue({isDone: isDone, title: title});
  };

  useEffect(() => { 
    if (isEdit === true) {
      handleCancel();
    }
  }, [listFilter]);


  const handleDelete = async(id: number) => {
    try {
      await deleteTodo(id);
    } catch (err) {
      if (err instanceof Error) {
        openNotification({
          type: 'error', 
          title: 'ERROR: Delete Todo', 
          description:`${err.message}`
        })
      }
    }
    await onUpdate();
  }

  const onChangeCheckbox = async () => { //toggle
    
    try {
      await editTodo(id, {title: title, isDone: !isDone});
    } catch (err) {
      if (err instanceof Error) {
        openNotification({
          type: 'error', 
          title: 'ERROR: Toggle Todo (Change checkbox)', 
          description:`${err.message}`
        })

      }
    }
    await onUpdate();
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  }

  return (
    <li className={`${s.wrapperTodo} ${isEdit ? s.wrapperTodoEdit : ''}`}>
      {isEdit ? <Form
        form={form}
        name="edit-todo"
        initialValues={{isDone: editIsDone, title: title}}
        onFinish={handleSubmitEditedTodo}
        onFinishFailed={onFinishFailed}
        style={{width: '100%'}}
      >
        <Row justify="space-between" gutter={10}>

          <Col flex="auto">
            <Flex gap={25} align="center">
              <Item<FieldType>
                label=""
                name="isDone"
              >
                <Checkbox onChange={onChangeEditCheckbox} />
              </Item>
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
                <Input 
                  value={editTitle}
                  onChange={onChangeInput}
                  style={{ width: '100%' }}
                />
              </Item>
            </Flex>
          </Col>

          <Col flex="none">
            <Space size={10}>
              <Button htmlType='submit'>Save</Button>
              <Button htmlType='reset' onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Col>

        </Row>
      </Form>

        : <>
          <div className={s.todo}>
            <Checkbox 
              onChange={onChangeCheckbox}
              checked={isDone}
            />
            <div className={`${s.title} ${isDone ? s.titleIsDone : ''}`}>{title}</div>

          </div>
          <div className={s.buttons}>
            <Button 
              htmlType='button'
              onClick={() => setIsEdit(true)}
            >
              Edit
            </Button>
            <Button 
              htmlType='button'
              onClick={() => handleDelete(id)}
            >
              Delete
            </Button>
          </div>
        </>}
    </li>
  )
}


export default TodoItem;