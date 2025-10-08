import type { MetaResponse, Filter, TodoRequest, Todo } from "../types/types";


const baseUrl = 'https://easydev.club/api/v1';

export const getAllTodos = async (filter: Filter) => {

  const searchParams = new URLSearchParams({
    filter: `${filter}`,
  });

  try {
    const response = await fetch(`${baseUrl}/todos?${searchParams.toString()}`);
    // const response = undefined;


    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: MetaResponse<Todo, Filter> = await response.json();
    return data;
  } catch (err) {
    // console.error('Error (getTodos), err: ', err);
    throw new Error(`Failed to fetch todos: ${err.message}`)
  }
}

export const createTodo = async (todo: TodoRequest) => {
  try {
    const response = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const newTodo: Todo = await response.json();
    return newTodo;

  } catch (err) {
    console.error('Error (createTodo), err: ', err);
  }
}

export const editTodo = async (id: number, todo: TodoRequest) => {
  try {
    const response = await fetch(`${baseUrl}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type' : 'application/json',
      },
    });
    const data: Todo = await response.json();
    console.log('data: ', data)

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