import { useEffect, useState } from 'react';
import type { Todo, Filter } from '../../types/types';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';

import { deleteTodo, editTodo } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './TodoItem.module.scss'



interface TodoProps {
  todo: Todo,
  listFilter: Filter,
  onUpdate: () => Promise<void>,
}

const TodoItem = ({ todo, listFilter, onUpdate }: TodoProps) => {

  const { id, title, isDone } = todo;
  const [ isEdit, setIsEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(title); //null
  const [ editError, setEditError ] = useState<string | null>(null);

  const handleCancel = () => {
    setEditTitle(title); 
    setEditError(null);
    setIsEdit(false);
  };

  useEffect(() => { //чтобы при смене вкладки сбрасывалось редактирование (React 19)
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

  const handleToggle = async () => {//toggle чего название
    try {
      await editTodo(id, {title: title, isDone: !isDone});
    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}`);
      }
    }
    await onUpdate();
  }

  const onClickEdit = () => {
    setIsEdit(true);
  }

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {//handleEdit
    setEditTitle(e.target.value);
  }

  const handleEditForm = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const validationMessage = getValidationMessage(editTitle);

    if (validationMessage !== null) {
      setEditError(validationMessage);
      return;
    }

    setEditError(null);
    try {
      await editTodo(id, {isDone: isDone, title: editTitle});
      
    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}`)
      }
    }
    setIsEdit(false);
    await onUpdate();
  }


  return (
    <li className={`${s.wrapperTodo} ${isEdit ? s.wrapperTodoEdit : ''}`}>
      {isEdit ? <>
        <form className={s.editForm} onSubmit={handleEditForm}>
          <div className={s.editTodo}>
            <input 
              type="checkbox" 
              className={s.checkbox} 
              checked={isDone} 
              onChange={() => handleToggle()}
            />
            <Input 
              name="title"
              value={editTitle}
              onChange={onChangeInput}
              error={editError}
            />
          </div>
          <div className={s.buttons}>
            <Button type='submit'>Save</Button>
            <Button onClick={() => handleCancel()}>
              Cancel
            </Button>
          </div>
        </form>
        </> 
        : <>
          <div className={s.todo}>
            <input 
              type="checkbox" 
              className={s.checkbox} 
              checked={isDone} 

              onChange={() => handleToggle()}
            />
            <div className={`${s.title} ${isDone ? s.titleIsDone : ''}`}>{title}</div>

          </div>
          <div className={s.buttons}>
            <Button 
              type='button'
              onClick={() => onClickEdit()}
            >
              Edit
            </Button>
            <Button 
              type='button'
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