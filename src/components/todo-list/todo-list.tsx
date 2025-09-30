import type { Dispatch, SetStateAction } from 'react';
import Todo from '../todo/todo';
import type { IFullTodo, TListsInfo, TFilter } from '../../types/types';
import s from './todo-list.module.scss';



interface ITodoListProps {
  todos: IFullTodo[],
  setTodos: Dispatch<SetStateAction<IFullTodo[] | null>>
  listFilter: TFilter,
  setListsInfo: Dispatch<SetStateAction<TListsInfo>>,
  listsInfo: TListsInfo,
}

const TodoList = ({ todos, setTodos, listFilter, setListsInfo, listsInfo }: ITodoListProps) => {

  return (
    <div className={s.todoList}>
      {todos?.map((item: IFullTodo) => {
        return <Todo 
          id={item.id}
          key={item.id}
          isDone={item.isDone}
          title={item.title}
          created={item.created}
          todos={todos}
          setTodos={setTodos}
          listFilter={listFilter}
          setListsInfo={setListsInfo}
          listsInfo={listsInfo}
        />
      })}
    </div>
  )
};


export default TodoList;