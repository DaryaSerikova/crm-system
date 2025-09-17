const baseUrl = 'https://easydev.club/api/v1';

interface ITodo {
  isDone: boolean,
  title: string,
}

export const getAllTodos = async () => {
  try {
    const response = await fetch(`${baseUrl}/todos`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error (getTodos), err: ', err);
  }
}

export const createTodo = async (todo: ITodo) => {
  try {
    // console.log('todo: ', todo)

    const response = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }

    });
    const newTodo = await response.json();
    // console.log(newTodo);
    return newTodo;

  } catch (err) {
    console.error('Error (createTodo), err: ', err);
  }
}