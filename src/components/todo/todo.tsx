import { useEffect, useState } from 'react';
import Button from '../button/button';
import s from './todo.module.scss';
import { deleteTodo, editTodo } from '../../api/api';
import Input from '../input/input';


export interface IFullTodo {
  created: string,
  id: number,
  isDone: true,
  title: string,
}

const Todo = (props: IFullTodo) => {
  const { id, title, isDone, todos, setTodos } = props;
  const [ checked, setChecked] = useState<boolean>(false);
  const [ isEdit, setIsEdit] = useState<boolean>(false);
  const [editTitle, setEditTitle] = useState<string|null>(null);

  useEffect(() => {
    setChecked(isDone);
    setEditTitle(title);
    console.log('useEffect,[]')
  }, []);

  const handleDelete = async(id) => {
    const response = await deleteTodo(id);
    console.log('response?.status', response?.status)

    if (response?.status === 200) {
      const newTodos = todos.filter((item) => (item.id !== id));
      setTodos(newTodos);
    }
  }
  const handleToggle = () => {
    editTodo(id, {title: title, isDone: !checked});
    setChecked(!checked);
  }

  const handleEdit = (e) => {
    setEditTitle(e.target.value);
  }

  const handleEditForm = async (e) => {
    e.preventDefault();
    const objData = await editTodo(id, {isDone: checked, title: editTitle});
    console.log('objData: ', objData);
    if (objData.status === 200) {
      const index = todos.findIndex((item) => item.id === id);
      const newTodos = [...todos.slice(0, index), objData?.editedTodo,...todos.slice(index+1)];
      console.log('index: ', index)
      setTodos(newTodos);
      setIsEdit(false);
    }
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

            />
          </div>
          <div className={s.buttons}>
            <Button
              type='submit' 
              text="Save"
            />
            <Button 
              text="Cancel"
              onClick={() => { setIsEdit(false)}}
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