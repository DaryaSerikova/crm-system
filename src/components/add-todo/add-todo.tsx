import { useState, type Dispatch, type SetStateAction } from 'react';
import Input from '../input/input';
import Button from '../button/button';
import { createTodo } from '../../api/api';
import { getValidation } from '../../utils/utils';
import type { IFullTodo, TFilter, TListsInfo } from '../../types/types';
import s from './add-todo.module.scss';


interface IAddTodoProps {
  todos: IFullTodo[] | null,
  setTodos: Dispatch<SetStateAction<IFullTodo[] | null>>,
  listsInfo: TListsInfo,
  setListsInfo: Dispatch<SetStateAction<TListsInfo>>
  listFilter: TFilter,
}

const AddTodo = ({todos, setTodos, listsInfo, setListsInfo, listFilter}: IAddTodoProps) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string|null>(null);

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;

    const formData = new FormData(formElement); 
    const titleValue = formData.get('title')?.toString().trim() || '';
    const validation = getValidation(titleValue);

    if (validation.isValid) {
      setError(null);

      const todo = {
        isDone: false,
        title: titleValue
      }

      const response = createTodo(todo);
      response.then((newTodo) => {// ts
        if (todos) {
          if(listFilter !== 'completed') {
            const newTodos: IFullTodo[] = todos?.length === 0 ? [newTodo] : [...todos, newTodo];
            setTodos(newTodos);
          }

          if (listsInfo) {
            setListsInfo({
              'all': listsInfo?.all + 1,
              'completed': newTodo?.isDone ? listsInfo?.completed + 1 : listsInfo?.completed,
              'inWork': newTodo?.isDone ? listsInfo?.inWork : listsInfo?.inWork + 1,
            });
          } else setListsInfo({
            'all': 1,
            'completed': newTodo?.isDone ? 1 : 0,
            'inWork': newTodo?.isDone ? 0 : 1,
          });
        }
      });

      // formElement.reset();
      setTitle('');
    }
    else setError(validation.message);
  }


  return (
    <form 
      className={s.form}
      onSubmit={handleForm}
      >
      <Input 
        error={error}
        name='title'
        value={title}
        onChange={(e) => {setTitle(e.target.value)}} 
      />
      <Button text="Add" type="submit"/>
    </form>
  )
}

export default AddTodo;