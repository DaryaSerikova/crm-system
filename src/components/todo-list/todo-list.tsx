import TodoItem from '../todo-item/todo-item';
import type { Todo, Filter } from '../../types/types';
import s from './todo-list.module.scss';



interface TodoListProps {
  todos: Todo[],
  onUpdate: (listFilter: Filter) => Promise<void>,
  listFilter: Filter,
}

const TodoList = ({ todos, onUpdate, listFilter }: TodoListProps) => {

  return (
    <ul className={s.todoList}>
      {todos?.map((item: Todo) => {
        return <TodoItem 
          key={item.id}
          todo={item}
          todos={todos}
          listFilter={listFilter}
          onUpdate={onUpdate}
        />
      })}
    </ul>
  )
};


export default TodoList;