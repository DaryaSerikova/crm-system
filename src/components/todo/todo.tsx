import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { IFullTodo, TListsInfo, TFilter } from '../../types/types';
import Button from '../button/button';
import Input from '../input/input';
import { deleteTodo, editTodo, getAllTodos } from '../../api/api';
import { getValidation } from '../../utils/utils';
import s from './todo.module.scss';



interface ITodoProps {
  created: string,
  id: number,
  isDone: boolean,
  title: string,
  todos: IFullTodo[],
  setTodos: Dispatch<SetStateAction<IFullTodo[] | null>>
  listFilter: TFilter,
  setListsInfo: Dispatch<SetStateAction<TListsInfo>>
}

const Todo = (props: ITodoProps) => {

  const { id, title, isDone, todos, setTodos, listFilter, setListsInfo } = props;

  const [ checked, setChecked] = useState<boolean>(false); //null
  const [ isEdit, setIsEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(''); //null 
  const [ editError, setEditError ] = useState<string | null>(null);

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

  useEffect(() => {
    if(isEdit === true) {
      setEditTitle(title);
      setEditError(null);
      setIsEdit(false);
    }
  }, [listFilter])


  const handleDelete = async(id: number) => {

    const handleDeleteTodo = async () => {
      await deleteTodo(id);
      const newTodosInfo = await getAllTodos(listFilter);
      setTodos(newTodosInfo?.data);
      setListsInfo(newTodosInfo?.info);
    }

    handleDeleteTodo();
  }

  const handleToggle = () => {
    const handleToggleTodo = async () => {
      await editTodo(id, {title: title, isDone: !checked});
      setChecked(!checked);

      const newTodosInfo = await getAllTodos(listFilter);
      setTodos(newTodosInfo?.data);
      setListsInfo(newTodosInfo?.info);
    }

    handleToggleTodo();
  }

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {//onChange
    setEditTitle(e.target.value);
  }

  const handleEditForm = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();
    const validation = getValidation(editTitle);

    if (validation.isValid) {
      setEditError(null);

      const handleEditTodo = async () => {
        await editTodo(id, {isDone: checked, title: editTitle});
        const newTodosInfo = await getAllTodos(listFilter);
        setIsEdit(false);
        setTodos(newTodosInfo?.data);
        // setListsInfo(newTodosInfo?.info);
      }
  
      handleEditTodo();
  
    } else setEditError(validation.message);
  }

  const handleCancel = () => {
    setEditTitle(title);
    setEditError(null);
    setIsEdit(false);
  }

  return (
    <div className={`${s.wrapperTodo} ${isEdit ? s.wrapperTodoEdit : ''}`}>
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
            <Button
              type='submit' 
              text="Save"
            />
            <Button 
              text="Cancel"
              onClick={() => handleCancel()}
            />
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
              text='Edit'
              onClick={() => {setIsEdit(true)}}
            />
            <Button 
              type='button'
              text='Delete'
              onClick={() => handleDelete(id)}
            />
          </div>
        </>}
    </div>
  )
}


export default Todo;