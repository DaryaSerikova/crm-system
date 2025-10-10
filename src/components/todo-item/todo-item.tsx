import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { Todo, TodoInfo, Filter } from '../../types/types';
import Button from '../button/button';
import Input from '../input/input';
import { deleteTodo, editTodo, getAllTodos } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './todo-item.module.scss'



interface TodoProps {
  created: string,
  id: number,
  isDone: boolean,
  title: string,
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[] | null>>
  listFilter: Filter,
  setListsInfo: Dispatch<SetStateAction<TodoInfo>>
}

const TodoItem = (props: TodoProps) => {

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
    const validationMessage = getValidationMessage(editTitle);

    if (validationMessage === null) {
      setEditError(null);

      const handleEditTodo = async () => {
        await editTodo(id, {isDone: checked, title: editTitle});
        const newTodosInfo = await getAllTodos(listFilter);
        setIsEdit(false);
        setTodos(newTodosInfo?.data);
        // setListsInfo(newTodosInfo?.info);
      }
  
      handleEditTodo();
  
    } else setEditError(validationMessage);

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
    </div>
  )
}


export default TodoItem;