import type { Dispatch, SetStateAction } from 'react';
import TodoItem from '../todo-item/todo-item';
import type { Todo, TodoInfo, Filter } from '../../types/types';
import s from './todo-list.module.scss';



interface TodoListProps {
  todos: Todo[],
  setTodos: Dispatch<SetStateAction<Todo[] | null>>
  listFilter: Filter,
  setListsInfo: Dispatch<SetStateAction<TodoInfo>>,
}

const TodoList = ({ todos, setTodos, listFilter, setListsInfo }: TodoListProps) => {

  return (
    <div className={s.todoList}>
      {todos?.map((item: Todo) => {
        return <TodoItem 
          id={item.id}
          key={item.id}
          isDone={item.isDone}
          title={item.title}
          created={item.created}
          todos={todos}
          setTodos={setTodos}
          listFilter={listFilter}
          setListsInfo={setListsInfo}
        />
      })}
    </div>
  )
};


export default TodoList;