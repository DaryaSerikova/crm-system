import { useState, type Dispatch, type SetStateAction } from 'react';
import Input from '../input/input';
import Button from '../button/button';
import type { IFullTodo, TFilter, TListsInfo } from '../../types/types';
import { createTodo, getAllTodos } from '../../api/api';
import { getValidation } from '../../utils/utils';
import s from './add-todo.module.scss';


interface IAddTodoProps {
  setTodos: Dispatch<SetStateAction<IFullTodo[] | null>>,
  setListsInfo: Dispatch<SetStateAction<TListsInfo>>
  listFilter: TFilter,
}

const AddTodo = ({ setTodos, setListsInfo, listFilter}: IAddTodoProps) => {
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

      const handleCreateTodo = async () => {
        await createTodo(todo);
        const newTodosInfo = await getAllTodos(listFilter);
        setTodos(newTodosInfo?.data);
        setListsInfo(newTodosInfo?.info);
      }

      handleCreateTodo();

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