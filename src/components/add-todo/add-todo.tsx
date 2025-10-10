import { useState } from 'react';
import Input from '../input/input';
import Button from '../button/button';
import type { TodoRequest, Filter } from '../../types/types';
import { createTodo } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './add-todo.module.scss';


interface AddTodoProps {
  // setTodos: Dispatch<SetStateAction<Todo[] | null>>,
  // setListsInfo: Dispatch<SetStateAction<TodoInfo>>
  listFilter: Filter,
  onUpdate: (listFilter: Filter) => Promise<void>,
}

const AddTodo = ({ listFilter, onUpdate,
  // setTodos, setListsInfo, 
}: AddTodoProps) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string|null>(null);

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => { //handleForm
    e.preventDefault();
    const validationMessage: string | null = getValidationMessage(title); //titleValue

    if (validationMessage === null) {
      setError(null);

      const todo: TodoRequest = {
        isDone: false,
        title: title //titleValue
      }

      //try catch и вывод юзеру
      try {
        await createTodo(todo);
      } catch (err) {
        alert(`${err.message}`)
      }
      await onUpdate(listFilter);

      // formElement.reset();
      setTitle('');
    }
    else setError(validationMessage);

  }


  return (
    <form 
      className={s.form}
      onSubmit={handleSubmitForm} 
      >
      <Input 
        error={error}
        name='title'
        value={title}
        onChange={(e) => {setTitle(e.target.value)}} 
      />
      <Button type="submit">Add</Button>
    </form>
  )
}

export default AddTodo;