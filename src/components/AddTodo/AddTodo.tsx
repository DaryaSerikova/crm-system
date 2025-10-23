import { useState } from 'react';
import Input from '../ui/Input/Input';
import Button from '../ui/Button/Button';
import type { TodoRequest } from '../../types/types';
import { createTodo } from '../../api/api';
import { getValidationMessage } from '../../utils/utils';
import s from './AddTodo.module.scss';


interface AddTodoProps {
  onUpdate: () => Promise<void>,
}

const AddTodo = ({ onUpdate }: AddTodoProps) => {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string|null>(null);
  

  const handleSubmitTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationMessage: string | null = getValidationMessage(title);

    if (validationMessage !== null) {
      setError(validationMessage);
      return;
    }
    setError(null);

    try {
      const todoRequest: TodoRequest = {
        isDone: false,
        title: title
      }
  
      await createTodo(todoRequest);
      await onUpdate();
      setTitle('');

    } catch (err) {
      if (err instanceof Error) {
        alert(`${err.message}`)
      }
    }
  }


  return (
    <form 
      className={s.form}
      onSubmit={handleSubmitTodo} 
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