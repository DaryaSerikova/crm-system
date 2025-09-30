import { useState, useEffect} from 'react';
import AddTodo from './components/add-todo/add-todo';
import TodoList from './components/todo-list/todo-list';
import Filters from './components/filters/filters';
import type { IFullTodo, TListsInfo, TFilter } from './types/types';
import { getAllTodos } from './api/api';
import s from './App.module.scss';



function App() {
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


  return (
    <div className={s.app}>
      <div className={s.card}>
        <h1 className={s.header}>To do</h1>

        <AddTodo 
          todos={todos}
          setTodos={setTodos}
          listsInfo={listsInfo}
          setListsInfo={setListsInfo}
          listFilter={listFilter}
        />

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
