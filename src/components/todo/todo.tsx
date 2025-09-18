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
  const { id, title, isDone } = props;
  const [ checked, setChecked] = useState<boolean>(false);
  const [ isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    setChecked(isDone);
    console.log('useEffect,[]')
  }, []);

  const handleDelete = (id) => {
    deleteTodo(id);
    //перезагрузить список отображения 
  }
  const handleToggle = () => {
    editTodo(id, {title: title, isDone: !checked});
    setChecked(!checked);
  }

  console.log('isEdit ', isEdit)


  return (
    <div className={`${s.wrapperTodo} ${isEdit ? s.wrapperTodoEdit : ''}`}>
      {isEdit ? <>
        <form className={s.editForm}>
          <div className={s.editTodo}>
            <input 
              type="checkbox" 
              className={s.checkbox} 
              checked={checked} 
              onChange={() => handleToggle()}
            />
            <Input 
              name="title"
              value={title}
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