import { useState, useEffect } from 'react';
import AddTodo from '../../components/add-todo/add-todo';
import Filters from '../../components/filters/filters';
import TodoList from '../../components/todo-list/todo-list';
import type { IFullTodo, TFilter, TListsInfo } from '../../types/types';
import { getAllTodos } from '../../api/api';
import s from './TodoListPage.module.scss';


// interface ITodoListPageProps {}

const TodoListPage = () => {
// const TodoListPage = (props: ITodoListPageProps) => {

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
    <div className={s.todoListPage}>
      <div className={s.card}>
        <h1 className={s.header}>To do</h1>

        <AddTodo 
          setTodos={setTodos}
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
          />}
      </div>
    </div>
  )
}

export default TodoListPage;