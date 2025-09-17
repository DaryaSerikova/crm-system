import s from './todo.module.scss';


export interface IFullTodo {
  created: string,
  id: number,
  isDone: true,
  title: string,
}

const Todo = (props: IFullTodo) => {
  const { id, title, isDone } = props;

  return (
    <div className={s.wrapperTodo}>
      <div className={s.todo}>
        <input type="checkbox" checked={isDone}/>
        <div>{title}</div>
      </div>
      <div className={s.buttons}>
        <div>btn1</div>
        <div>btn2</div>
      </div>
    </div>
  )
}

export default Todo;