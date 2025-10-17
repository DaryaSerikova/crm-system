import TodoItem from '../todo-item/todo-item';
import type { Todo } from '../../types/types';
import s from './todo-list.module.scss';



interface TodoListProps {
  todos: Todo[],
  onUpdate: () => Promise<void>,
}

const TodoList = ({ todos, onUpdate }: TodoListProps) => {

  return (
    <ul className={s.todoList}>
      {todos?.map((item: Todo) => {
        return <TodoItem 
          key={item.id}
          todo={item}
          onUpdate={onUpdate}
        />
      })}
    </ul>
  )
};


export default TodoList;