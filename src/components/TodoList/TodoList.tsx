import TodoItem from '../TodoItem/TodoItem';
import type { Filter, Todo } from '../../types/todo.types';
import s from './TodoList.module.scss';



interface TodoListProps {
  todos: Todo[],
  onUpdate: () => Promise<void>,
  listFilter: Filter,
}

const TodoList = ({ todos, onUpdate, listFilter }: TodoListProps) => {

  return (
    <ul className={s.todoList}>
      {todos?.map((item: Todo) => {
        return <TodoItem 
          key={item.id}
          todo={item}
          onUpdate={onUpdate}
          listFilter={listFilter}
        />
      })}
    </ul>
  )
};


export default TodoList;