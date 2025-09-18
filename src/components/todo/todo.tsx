import { useEffect, useState } from 'react';
import Button from '../button/button';
import s from './todo.module.scss';
import { editTodo } from '../../api/api';


export interface IFullTodo {
  created: string,
  id: number,
  isDone: true,
  title: string,
}

const Todo = (props: IFullTodo) => {
  const { id, title, isDone } = props;
  const [ checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    setChecked(isDone);
  },[]);

  useEffect(() => {
    //to server
    editTodo(id, {title: title, isDone: checked});
  }, [checked]);

  return (
    <div className={s.wrapperTodo}>
      <div className={s.todo}>
        <input 
          type="checkbox" 
          className={s.checkbox} 
          checked={checked} 
          onChange={() => setChecked(!checked)}
        />
        <div className={`${s.title} ${checked ? s.titleIsDone : ''}`}>{title}</div>
      </div>
      <div className={s.buttons}>
        <Button 
          type='button'
          text='Edit'
        />
        <Button 
          type='button'
          text='Delete'
        />
      </div>
    </div>
  )
}

export default Todo;