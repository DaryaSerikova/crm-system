import { useState, useEffect} from 'react';
import { createTodo, getAllTodos } from './api/api';
import TodoList from './components/todo-list/todo-list';
import Button from './components/button/button'
import Input from './components/input/input'
import Filters from './components/filters/filters';
import type { IFullTodo } from './components/todo/todo';
import { getValidation } from './utils/utils';
import s from './App.module.scss';



export type TListsInfo = {
  all: number,
  completed: number,
  inWork: number,
} | null;

export type TFilter = "all" | "completed" | "inWork";


function App() {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string|null>(null);
  const [todos, setTodos] = useState<IFullTodo[] | null>(null);
  const [listFilter, setListFilter] = useState<TFilter>("all");
  const [listsInfo, setListsInfo] = useState<TListsInfo>(null);

  useEffect(() => {
    if (todos === null) {
      getAllTodos(listFilter).then(allTodos => {
        setTodos(allTodos.data);
        setListsInfo(allTodos.info);
      });
    }
  }, []);

  useEffect(() => {
    if (todos !== null) {
      getAllTodos(listFilter).then(allTodos => {
        setTodos(allTodos.data);
        setListsInfo(allTodos.info);
      });
    }
    
  }, [listFilter]);



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
      response.then((newTodo) => {
        if (todos) {
          const newTodos: IFullTodo[] = todos?.length === 0 ? [newTodo] : [...todos, newTodo];
          setTodos(newTodos);
        }
      });

      // formElement.reset();
      setTitle('');
    }
    else setError(validation.message);
  }

  return (
    <div className={s.app}>
      <div className={s.card}>
        <h1 className={s.header}>To do</h1>
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
        <Filters 
          setListFilter={setListFilter}
          listsInfo={listsInfo}
        />
        { todos && <TodoList 
          todos={todos} 
          setTodos={setTodos} 
          listFilter={listFilter}
          setListsInfo={setListsInfo}
          listsInfo={listsInfo}
          />}
      </div>
    </div>
  )
}

export default App;
