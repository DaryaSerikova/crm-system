import type { 
  MetaResponse, Filter, TodoRequest, Todo, TodoInfo, 
  UserRegistration, Profile, AuthData, Token 
} from "../types/types";
const baseUrl = 'https://easydev.club/api/v1';
import axios from 'axios';
import { store } from '../store/store';
import { setAuth, removeAuth } from "@/store/slices/authSlice";

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => { //перед запросом
  const state = store.getState();
  const accessToken = state.auth.accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use((response) => response, //после ответа
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true;
      const oldRefreshToken = localStorage.getItem('refreshToken');

      try {
        const res = await axios.post(`${baseUrl}/auth/refresh`, {refreshToken: oldRefreshToken});
        const { accessToken, refreshToken } = res.data; //new tokens

        localStorage.setItem('refreshToken', refreshToken);
        store.dispatch(setAuth(accessToken));

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch(removeAuth()); //logout
        localStorage.removeItem('refreshToken');

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);



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

//--- auth ---

export const registerUser = async (user: UserRegistration): Promise<Profile | undefined> => {
  try {
    const response =  await api.post('/auth/signup', user);    
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to register user: ${err.message}`);
    }
  }
}

export const loginUser = async (user: AuthData): Promise<Token | undefined> => {
  try {
    const response = await api.post('/auth/signin', user);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to login user: ${err.message}`)
    }
  }
}

export const getUserProfile = async (): Promise<Profile | undefined> => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error)
      throw new Error(`Failed to get user profile: ${err.message}`);
  }
}