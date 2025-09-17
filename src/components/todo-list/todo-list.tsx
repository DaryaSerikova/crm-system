import s from './todo-list.module.scss';
import Todo, { type IFullTodo } from '../todo/todo';



const TodoList = ({ todos }: IFullTodo[]) => {
  return (
    <div className={s.todoList}>
      {todos?.map((item: IFullTodo) => 
        <Todo 
          id={item.id}
          isDone={item.isDone}
          title={item.title}
          created={item.created}
        />
      )}
    </div>
  )
}

export default TodoList;