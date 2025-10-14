import { useEffect, useState } from 'react';
import type { Todo, Filter } from '../../types/types';
import Button from '../button/button';
import Input from '../input/input';
import { deleteTodo, editTodo } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './todo-item.module.scss'



interface TodoProps {
  created: string,
  id: number,
  isDone: boolean,
  title: string,
  todos: Todo[],
  listFilter: Filter,
  onUpdate: (listFilter: Filter) => Promise<void>,
}

const TodoItem = (props: TodoProps) => {

  const { id, title, isDone, todos, onUpdate, listFilter } = props;

  const [ checked, setChecked] = useState<boolean>(false); //null
  const [ isEdit, setIsEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(''); //null 
  const [ editError, setEditError ] = useState<string | null>(null);

  const handleCancel = () => {
    setEditTitle(title);
    setEditError(null);
    setIsEdit(false);
  }

  useEffect(() => {
    if (checked === null) setChecked(isDone);
    setEditTitle(title);
  }, []);

  useEffect(() => {
    setChecked(isDone);
  }, [isDone, todos]);

  useEffect(() => {
    setEditTitle(title);
  }, [title]);

  useEffect(() => { //это нужно, чтобы при смене вкладки сбрасывалось редактирование
    if (isEdit === true) {
      handleCancel();
    }
  }, [listFilter])

  const handleDelete = async(id: number) => {
    try {
      await deleteTodo(id);
    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}`);
      }
    }
    await onUpdate(listFilter);
  }

  const handleToggle = async () => {
    try {
      await editTodo(id, {title: title, isDone: !checked});
    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}`);
      }
    }
    setChecked(!checked);
    await onUpdate(listFilter);
  }

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {//onChange
    setEditTitle(e.target.value);
  }

  const handleEditForm = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const validationMessage = getValidationMessage(editTitle);

    if (validationMessage === null) {
      setEditError(null);
      try {
        await editTodo(id, {isDone: checked, title: editTitle});
      } catch (err) {
        if (err instanceof Error) {
          alert(`${err.message}`)
        }
      }
      setIsEdit(false);
      await onUpdate(listFilter);
    } else setEditError(validationMessage);
  }


  return (
    <li className={`${s.wrapperTodo} ${isEdit ? s.wrapperTodoEdit : ''}`}>
      {isEdit ? <>
        <form className={s.editForm} onSubmit={handleEditForm}>
          <div className={s.editTodo}>
            <input 
              type="checkbox" 
              className={s.checkbox} 
              checked={checked} 
              onChange={() => handleToggle()}
            />
            <Input 
              name="title"
              value={editTitle}
              onChange={handleEdit}
              error={editError}
            />
          </div>
          <div className={s.buttons}>
            <Button type='submit'>
              Save
            </Button>
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
              checked={checked} 
              onChange={() => handleToggle()}
            />
            <div className={`${s.title} ${checked ? s.titleIsDone : ''}`}>{title}</div>
          </div>
          <div className={s.buttons}>
            <Button 
              type='button'
              onClick={() => {setIsEdit(true)}}
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