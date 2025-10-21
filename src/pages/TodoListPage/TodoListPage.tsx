import { useState, useEffect, useCallback } from 'react';
import AddTodo from '../../components/AddTodo/AddTodo';
import TodoFilters from '../../components/TodoFilters/TodoFilters';
import TodoList from '../../components/TodoList/TodoList';
import type { Todo, Filter, TodoInfo, MetaResponse } from '../../types/types';
import { getAllTodos } from '../../api/api';
import s from './TodoListPage.module.scss';



const TodoListPage = () => {

  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [listFilter, setListFilter] = useState<Filter>("all");
  const [todoInfo, setTodoInfo] = useState<TodoInfo | null>(null); //listsInfo, setListsInfo //todoInfo


  const fetchAndSetTodos = useCallback(async (listFilter: Filter) => {
    return await getAllTodos(listFilter)
      .then((allTodos: MetaResponse<Todo, TodoInfo>) => {
        setTodos(allTodos.data);
        if (allTodos.info) {//if из-за ts и MetaResponse, info? - поэтому мб undefined
          setTodoInfo(allTodos.info); 
        }
      }).catch((err) => {
        if (err instanceof Error) {
          alert(`
            NAME: ${err.name}, 
            MESSAGE: ${err.message}, 
            STACK: ${err.stack}
          `);
        }
      })
  }, []);//создается один раз

  useEffect(() => {
    fetchAndSetTodos(listFilter);
  }, []);

  useEffect(() => {
    // if (todos !== null) {
      fetchAndSetTodos(listFilter);
    // }
  }, [listFilter]);


  return (
    <div className={s.todoListPage}>
      <div className={s.card}>
        <h1 className={s.header}>To do</h1>

        <AddTodo onUpdate={() => fetchAndSetTodos(listFilter)}/>

        <TodoFilters 
          setListFilter={setListFilter}
          todoInfo={todoInfo}
        />
        { todos && <TodoList 
            todos={todos} 
            onUpdate={() => fetchAndSetTodos(listFilter)}
            listFilter={listFilter}
          />}
      </div>
    </div>
  )
}

export default TodoListPage;