import type { TFilter } from "../App";

const baseUrl = 'https://easydev.club/api/v1';

interface ITodo {
  isDone: boolean,
  title: string,
}

// interface IFullTodo {
//   created: string,
//   id: 0,
//   isDone: true,
//   title: string
// }

export const getAllTodos = async (filter: TFilter) => {

  const searchParams = new URLSearchParams({
    'filter': `${filter}`,
  });

  try {
    const response = await fetch(`${baseUrl}/todos?${searchParams.toString()}`);
    // const response = await fetch(`${baseUrl}/todos`);
    const data = await response.json();
    console.log('response (getAllTodos): ', response)
    console.log('data (getAllTodos): ', data);
    return data;
  } catch (err) {
    console.error('Error (getTodos), err: ', err);
  }
}

export const createTodo = async (todo: ITodo) => {
  try {
    const response = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const newTodo = await response.json();
    return newTodo;

  } catch (err) {
    console.error('Error (createTodo), err: ', err);
  }
}

export const editTodo = async (id: number, todo: ITodo) => {
  try {
    const response = await fetch(`${baseUrl}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type' : 'application/json',
      },
    });
    const data = await response.json();
    return {editedTodo: data, status: response.status};

  } catch (err) {
    console.error('editTodo, ERROR, ', err);
  }
}

export const deleteTodo = async (id: number) => {
  try {
    const response = await fetch(`${baseUrl}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },   
    })
    return response;

  } catch (err) {
    console.error('deleteTodo ERROR: ', err)
  }
}