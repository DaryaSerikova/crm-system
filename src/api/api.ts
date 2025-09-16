const baseUrl = 'https://easydev.club/api/v1';


export const getAllTodos = async () => {
  try {
    const response = await fetch(`${baseUrl}/todos`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error (getTodos), err: ', err);
  }
}

export const createTodo = async (todo) => {
  try {
    console.log('createTodo, try: ')
    console.log('todo: ', todo)

    const response = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }

    });
    const newTodo = await response.json();
    console.log(newTodo);
    return newTodo;

  } catch (err) {
    console.error('Error (createTodo), err: ', err);
  }
}