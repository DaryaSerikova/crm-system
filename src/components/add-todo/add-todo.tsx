import { useState } from 'react';
import Input from '../ui/input/input';
import Button from '../ui/button/button';
import type { TodoRequest } from '../../types/types';
import { createTodo } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './add-todo.module.scss';


interface AddTodoProps {
  onUpdate: () => Promise<void>,
}

const AddTodo = ({ onUpdate }: AddTodoProps) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string|null>(null);

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationMessage: string | null = getValidationMessage(title);

    if (validationMessage !== null) {
      setError(validationMessage);
      return;
    }


    setError(null);

    const todo: TodoRequest = {
      isDone: false,
      title: title
    }

    try {
      await createTodo(todo);
    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}`)
      }
    }
    await onUpdate();

    setTitle('');


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