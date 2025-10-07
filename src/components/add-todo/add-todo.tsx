import { useState, type Dispatch, type SetStateAction } from 'react';
import Input from '../input/input';
import Button from '../button/button';
import type { Todo, TodoRequest, Filter, TodoInfo } from '../../types/types';
import { createTodo, getAllTodos } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './add-todo.module.scss';


interface AddTodoProps {
  setTodos: Dispatch<SetStateAction<Todo[] | null>>,
  setListsInfo: Dispatch<SetStateAction<TodoInfo>>
  listFilter: Filter,
}

const AddTodo = ({ setTodos, setListsInfo, listFilter}: AddTodoProps) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string|null>(null);

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;

    const formData = new FormData(formElement); 
    const titleValue = formData.get('title')?.toString().trim() || '';
    const validationMessage: string | null = getValidationMessage(titleValue);


    if (validationMessage === null) {
      setError(null);

      const todo: TodoRequest = {
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
    // else setError(validation.message);
    else setError(validationMessage);

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