import s from './todo-list.module.scss';
import Todo, { type IFullTodo } from '../todo/todo';



const TodoList = ({ todos, setTodos }: IFullTodo[]) => {
  return (
    <div className={s.todoList}>
      {todos?.map((item: IFullTodo) => 
        <Todo 
          id={item.id}
          isDone={item.isDone}
          title={item.title}
          created={item.created}
          todos={todos}
          setTodos={setTodos}
        />
      )}
    </div>
  )
}

export default TodoList;