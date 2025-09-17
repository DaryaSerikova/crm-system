import { createTodo } from './api/api';
import s from './App.module.scss';
import Button from './components/button/button'
import Input from './components/input/input'
import { useState, } from 'react';


function App() {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string|null>(null);

  const getValidation = (str: string) => {

    if (str.length === 0) {
      setError("Поле не может быть пустым!");
      return false;
    }
    else {
      const regexp = new RegExp("^.{2,64}$", "g");
      const result = regexp.test(str);
      if (!result) {
        if (str.length < 2 ) setError("Cимволов не может быть менее 2");
        if (str.length > 64 ) setError("Cимволов не может быть более 64");
      }
      return result;
    }
  }

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;

    const formData = new FormData(formElement); 
    const titleValue = formData.get('title')?.toString().trim() || '';
    const isValid = getValidation(titleValue);

    // console.log('titleValue: ', titleValue);
    // console.log('isValid: ', isValid)


    if (isValid) {
      setError(null);

      const todo = {
        isDone: false,
        title: titleValue
      }
      createTodo(todo);
      // formElement.reset();
      setName('');
    }
    else console.log('it is not valid value')
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
            value={name}
            onChange={(e) => {setName(e.target.value)}} 
          />
          <Button text="Add" type="submit"/>
        </form>
      </div>
    </div>
  )
}

export default App;
