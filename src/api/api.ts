import type { MetaResponse, Filter, TodoRequest, Todo, TodoInfo } from "../types/types";
const baseUrl = 'https://easydev.club/api/v1';
import axios from 'axios';

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllTodos = async (filter: Filter): Promise<MetaResponse<Todo, TodoInfo>> => {
  try {
    const response = await api.get(`/todos`, {
      params: {filter: filter}
    })
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed to get all todos: ${err.message}`);
    }
    throw err;
  }
}

export const createTodo = async (todo: TodoRequest): Promise<Todo> => {
  try {
    const response = await api.post(`/todos`, todo);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to create new todo: ${err.message}`);
    }
    throw err; 
  }
}

export const editTodo = async (id: number, todo: TodoRequest): Promise<{editedTodo: Todo, status: number}> => {
  try {
    const response = await api.put(`/todos/${id}`, todo);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to change (edit/toggle) todo: ${err.message}`)
    }
    throw err; 
  }
}

export const deleteTodo = async (id: number): Promise<undefined> => {
  try {
    await api.delete(`/todos/${id}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to delete todo: ${err.message}`)
    }
  }
}