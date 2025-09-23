import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { deleteTodo, editTodo } from '../../api/api';
import Button from '../button/button';
import Input from '../input/input';
import s from './todo.module.scss';
import { getValidation } from '../../utils/utils';
import type { TFilter, TListsInfo } from '../../App';


export interface IFullTodo {
  created: string,
  id: number,
  isDone: boolean,
  title: string,
}

interface ITodoProps {
  created: string,
  id: number,
  isDone: boolean,
  title: string,
  todos: IFullTodo[],
  setTodos: Dispatch<SetStateAction<IFullTodo[] | null>>
  listFilter: TFilter,
  setListsInfo: Dispatch<SetStateAction<TListsInfo>>
  listsInfo: TListsInfo,
}

const Todo = (props: ITodoProps) => {

  const { id, title, isDone, todos, setTodos, listFilter, setListsInfo, listsInfo } = props;

  const [ checked, setChecked] = useState<boolean>(false); //null
  const [ isEdit, setIsEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string>(''); //null проверить как работает !!!!!
  const [ editError, setEditError ] = useState<string | null>(null);

  useEffect(() => {
    if (checked === null) setChecked(isDone);
    setEditTitle(title);
    // console.log('Todo, useEffect,[]')
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
    const response = await deleteTodo(id);

    if (response?.status === 200) {
      const newTodos = todos.filter((item) => (item.id !== id));
      setTodos(newTodos);

      if (listsInfo) {
        const all = listsInfo?.all;

        setListsInfo({
          'all': listsInfo?.all - 1,
          'completed': listFilter === 'completed' ? newTodos.length : (all - 1) - newTodos.length,
          'inWork': listFilter === 'inWork' ? newTodos.length : (all - 1) - newTodos.length,
        });
      }
    }
  }
  
  const handleToggle = async () => {
    console.log('handleToggle, !checked:', !checked)
    const response = await editTodo(id, {title: title, isDone: !checked})
    setChecked(!checked);
    // response.json();
    console.log('!!!!!!!!!!!!!!!!! response.status', response?.status);

    if (response?.status === 200) {
      if (listFilter ==='inWork' || listFilter === 'completed') {
      //удалить ненужный эл
      const newTodos = todos.filter((item) => (item.id !== id));
      setTodos(newTodos);
      }

      console.log('!!!!! listsInfo:', listsInfo);

      // if (listFilter ==='all') {
      if (listsInfo) {
        setListsInfo({
          'all': listsInfo?.all, 
          'completed': !checked ? listsInfo?.completed + 1 : listsInfo?.completed - 1, 
          'inWork': !checked ? listsInfo?.inWork - 1 : listsInfo?.inWork + 1,
        });
      }
      // }

    }

  }

  const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {///??????ts
    setEditTitle(e.target.value);
  }

  const handleEditForm = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault();

    const validation = getValidation(editTitle);

    if (validation.isValid) {
        setEditError(null);

      const objData = await editTodo(id, {isDone: checked, title: editTitle});
  
      if (objData?.status === 200) {
        const index = todos.findIndex((item: IFullTodo) => item.id === id);
        const newTodos = [
          ...todos.slice(0, index), 
          objData?.editedTodo,
          ...todos.slice(index+1)];
  
        setTodos(newTodos);
        setIsEdit(false);
      }
    } else setEditError(validation.message)

  }

  const handleCancel = () => {
    setEditTitle(title);
    setEditError(null);
    setIsEdit(false);
  }

  // console.log(title, ', checked: ', checked)

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