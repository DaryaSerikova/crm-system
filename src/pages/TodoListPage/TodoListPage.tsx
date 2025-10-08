import { useState, useEffect, useCallback } from 'react';
import AddTodo from '../../components/add-todo/add-todo';
import TodoFilters from '../../components/todo-filters/todo-filters';
import TodoList from '../../components/todo-list/todo-list';
import type { Todo, Filter, TodoInfo } from '../../types/types';
import { getAllTodos } from '../../api/api';
import s from './TodoListPage.module.scss';


// interface TodoListPageProps {}

const TodoListPage = () => {
// const TodoListPage = (props: TodoListPageProps) => {

  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [listFilter, setListFilter] = useState<Filter>("all");
  const [listsInfo, setListsInfo] = useState<TodoInfo>(null);


  const fetchAndSetTodos = useCallback(async (listFilter: Filter) => {
    return getAllTodos(listFilter)
      .then(allTodos => {
        setTodos(allTodos.data);
        setListsInfo(allTodos.info);
      }).catch((err) => {
        alert(`
          NAME: ${err.name}, 
          MESSAGE: ${err.message}, 
          STACK: ${err.stack}
        `);
      })
  }, []);//создается один раз

  useEffect(() => {
    fetchAndSetTodos(listFilter);
  }, []);

  useEffect(() => {
    if (todos !== null) {
      fetchAndSetTodos(listFilter);
    }
  }, [listFilter]);


  return (
    <div className={s.todoListPage}>
      <div className={s.card}>
        <h1 className={s.header}>To do</h1>

        <AddTodo 
          // setTodos={setTodos}
          // setListsInfo={setListsInfo}
          onUpdate={fetchAndSetTodos}
          listFilter={listFilter}
        />

        <TodoFilters 
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