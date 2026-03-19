import { useEffect, useState } from 'react';
import type { Todo, Filter, TodoRequest } from '../../types/types';
import { deleteTodo, editTodo } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './TodoItem.module.scss'


import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, Row, Col, Space, Flex } from 'antd';
import type { CheckboxProps } from 'antd';

import { getValidationMessageAntd } from '../../utils/utils';



interface TodoProps {
  todo: Todo,
  listFilter: Filter,
  onUpdate: () => Promise<void>,
}

const TodoItem = ({ todo, listFilter, onUpdate }: TodoProps) => {

  const { id, title, isDone } = todo;
  const [ isEdit, setIsEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(title); //нужен!!!!!! 
  const [ editIsDone, setEditIsDone ] = useState<boolean>(isDone); //добавленное
  // const [ editError, setEditError ] = useState<string | null>(null);

  const { Item } = Form;

  type FieldType = {
    isDone?: boolean;
    title?: string;
  };

  const [form] = Form.useForm();

  useEffect(() => {
    const initialData = {isDone: isDone, title: title};
    form.setFieldsValue(initialData);
  }, [form, isDone, title]);
  
  useEffect(() => {
    console.log('render');
  });

  const handleSubmitEditedTodo: FormProps<FieldType>['onFinish'] = async (values) => {
    console.log('Success:', values);

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
        alert(`${err.message}`)
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
    // setEditIsDone(null);  //добавленное

    // setEditError(null); //?
    setIsEdit(false);
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
        alert(`${err.message}`);
      }
    }
    await onUpdate();
  }

  const onChangeCheckbox = async () => { //toggle
    
    try {
      await editTodo(id, {title: title, isDone: !isDone});
    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}`);
      }
    }
    await onUpdate();
  }


  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditTitle(e.target.value);
  }


  // const handleSubmitEditedTodo = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   // const validationMessage = getValidationMessage(editTitle);
  //   const validationMessage: string = getValidationMessage(editTitle);


  //   // if (validationMessage !== null) {
  //   if (validationMessage !== '') {
  //     setEditError(validationMessage);
  //     return;
  //   }
  //   setEditError(null);

  //   try {
  //     const todoRequest: TodoRequest = {
  //       isDone: isDone,
  //       title: editTitle
  //     }

  //     await editTodo(id, todoRequest);
  //     setIsEdit(false);
  //     await onUpdate();

  //   } catch (err) {
  //     if (err instanceof Error) {
  //       alert(`${err.message}`)
  //     }
  //   }
  // }


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
                <Checkbox 
                  // className={s.checkbox} 
                  onChange={onChangeEditCheckbox}
                  // defaultChecked={isDone}
                  // checked={editIsDone}
                />
              </Item>
              <Item<FieldType>
                label=""
                name="title"
                rules={[{ validator: (_, value) => getValidationMessageAntd(value) }]}

                style={{ flex: 1 }}
              >
                <Input 
                  value={editTitle}
                  onChange={onChangeInput}
                  style={{ width: '100%' }}
                  // error={editError}
                />
              </Item>
            </Flex>
          </Col>

          <Col flex="none">
            <Space size={10}>
              <Button htmlType='submit'>Save</Button>
              <Button htmlType='reset' onClick={() => handleCancel()}>
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
            {/* <input 
              type="checkbox" 
              className={s.checkbox} 
              checked={isDone} 

              onChange={() => handleToggle()}
            /> */}
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