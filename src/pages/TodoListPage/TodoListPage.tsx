import { useState, useEffect, useCallback } from 'react';
import type { Todo, Filter, TodoInfo, MetaResponse } from '../../types/types';
import AddTodo from '../../components/AddTodo/AddTodo';
import TodoFilters from '../../components/TodoFilters/TodoFilters';
import TodoList from '../../components/TodoList/TodoList';
import { openNotification } from '@/utils/errors';
import { getAllTodos } from '../../api/api';
import s from './TodoListPage.module.scss';



const TodoListPage = () => {
  const [todos, setTodos] = useState<Todo[] | null>(null);
  const [listFilter, setListFilter] = useState<Filter>("all");
  const [todoInfo, setTodoInfo] = useState<TodoInfo | null>(null);

  const fetchAndSetTodos = useCallback(async (listFilter: Filter) => {
    return await getAllTodos(listFilter)
      .then((allTodos: MetaResponse<Todo, TodoInfo>) => {
        setTodos(allTodos.data);
        if (allTodos.info) {
          setTodoInfo(allTodos.info); 
        }
      }).catch((err) => {
        if (err instanceof Error) {
          openNotification({
            type: 'error', 
            title: 'ERROR: Get All Todo', 
            description:`${err.message}`
          })
        }
      })
  }, []);

  useEffect(() => {
    fetchAndSetTodos(listFilter);
  }, []);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
  
    const autoFetch = async () => {
      await fetchAndSetTodos(listFilter);
      timerId = setTimeout(autoFetch, 5000);
    };
  
    autoFetch();
  
    // Очистка при уходе со страницы/изменении фильтра
    return () => {
      if (timerId) clearTimeout(timerId);
    };
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