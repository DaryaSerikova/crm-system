import { useState, useEffect} from 'react';
import { createTodo, getAllTodos } from './api/api';
import TodoList from './components/todo-list/todo-list';
import Todo from './components/todo/todo';
import Button from './components/button/button'
import Input from './components/input/input'
import s from './App.module.scss';



function App() {
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<string|null>(null);
  const [todos, setTodos] = useState(null);

  useEffect(() => {
    getAllTodos().then(allTodos => {
      setTodos(allTodos.data);
    });
  }, []);


  console.log('todos: ', todos);

  const getValidation2 = (str: string) => {
    if (str.length === 0) return {isValid: false, message: "Поле не может быть пустым!"};
    else {
      const regexp = new RegExp("^.{2,64}$", "g");
      const result = regexp.test(str);
      if (!result) {
        if (str.length < 2 ) return {isValid: false, message: "Cимволов не может быть менее 2"}
        if (str.length > 64 ) return {isValid: false, message: "Cимволов не может быть более 64"}
      }
    }
    return {isValid: true, message: null};

  }

  // const getValidation = (str: string) => {

  //   if (str.length === 0) {
  //     setError("Поле не может быть пустым!");
  //     return false;
  //   }
  //   else {
  //     const regexp = new RegExp("^.{2,64}$", "g");
  //     const result = regexp.test(str);
  //     if (!result) {
  //       if (str.length < 2 ) setError("Cимволов не может быть менее 2");
  //       if (str.length > 64 ) setError("Cимволов не может быть более 64");
  //     }
  //     return result;
  //   }
  // }

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;

    const formData = new FormData(formElement); 
    const titleValue = formData.get('title')?.toString().trim() || '';
    const validation = getValidation2(titleValue);

    // const isValid = getValidation(titleValue);
    // const isValid = validation.isValid;


    // console.log('titleValue: ', titleValue);
    // console.log('isValid: ', isValid)


    if (validation.isValid) {
      setError(null);

      const todo = {
        isDone: false,
        title: titleValue
      }
      const response = createTodo(todo);
      response.then((newTodo) => {
        const newTodos = todos?.length === 0 ? [newTodo] : [...todos, newTodo];
        
        console.log('newTodo: ', newTodo);
        console.log('newTodos: ', newTodos);

        setTodos(newTodos);
      });

      // formElement.reset();
      setTitle('');
    }
    else setError(validation.message);
  }

  return (
    <div className={s.app}>
      <div className={s.card}>
        <h1 className={s.header}>To do</h1>
        <form 
          className={s.form}
          onSubmit={handleForm}
          >
          <Input 
            error={error}
            name='title'
            value={title}
            onChange={(e) => {setTitle(e.target.value)}} 
          />
          <Button text="Add" type="submit"/>
        </form>

        { todos 
        ? <TodoList todos={todos} setTodos={setTodos}/> 
        : <></>}
        {/* <Todo isDone={false} title='dnjkfhndkjf'/> */}
      </div>
    </div>
  )
}

export default App;
