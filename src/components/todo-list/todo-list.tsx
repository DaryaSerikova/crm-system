import s from './todo-list.module.scss';
import Todo, { type IFullTodo } from '../todo/todo';
import { memo } from 'react';



// const TodoList = memo(({ todos, setTodos }: IFullTodo[]) => {
const TodoList = ({ todos, setTodos, filters }: IFullTodo[]) => {

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
          filters={filters}
        />
      }
      )}
    </div>
  )
// });
};


export default TodoList;