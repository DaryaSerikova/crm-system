import s from './todo-list.module.scss';
import Todo, { type IFullTodo } from '../todo/todo';
import type { Dispatch, SetStateAction } from 'react';
import type { TFilter } from '../../App';

interface ITodoListProps {
  todos: IFullTodo[],
  setTodos: Dispatch<SetStateAction<IFullTodo[] | null>>
  listFilter: TFilter,
}

const TodoList = ({ todos, setTodos, listFilter }: ITodoListProps) => {

  console.log('TodoList, todos: ', todos)
  return (
    <div className={s.todoList}>
      {todos?.map((item: IFullTodo) => {
        // console.log('item: ', item)
        return <Todo 
          id={item.id}
          isDone={item.isDone}
          title={item.title}
          created={item.created}
          todos={todos}
          setTodos={setTodos}
          listFilter={listFilter}
        />
      }
      )}
    </div>
  )
};


export default TodoList;