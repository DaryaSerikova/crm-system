import type { UserRegistration, Profile, AuthData, Token } from "../types/user.types";
import type { MetaResponse, Filter, TodoRequest, Todo, TodoInfo, } from "../types/todo.types"
import axios, { AxiosError } from 'axios';
import { store } from '../store/store';
import { setAuth, removeAuth } from "@/store/slices/authSlice";
import { accessTokenManager } from "@/store/tokenStorage";
import type { Params, User, UserRequest } from "@/types/admin.types";

const baseUrl = 'https://easydev.club/api/v1';
const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

const handleUnauthorizedError = async (error: AxiosError) => {
  console.log('UNAUTHORIZED ERROR error: ', error)
  console.log('UNAUTHORIZED ERROR axios.isCancel(error): ', axios.isCancel(error))

  if (axios.isCancel(error)) {
    return Promise.reject(error);
  }

  const originalRequest = error.config;
  const isUnauthorized = error.response?.status === 401;
  const isRetry = originalRequest._isRetry;

  if (isUnauthorized && !isRetry) {
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
      console.log('REFRESH ERROR')
      store.dispatch(removeAuth()); //logout
      localStorage.removeItem('refreshToken');

      return Promise.reject(refreshError);
    }
  }

  return Promise.reject(error);
}

api.interceptors.request.use((config) => { //перед запросом
  const accessToken = accessTokenManager.get();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use((response) => response, //после ответа
  (error) => handleUnauthorizedError(error)
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

// ---- admin---

export const getUsers = async (params: Params, controller: AbortController) => {
  try {
    const response = await api.get('/admin/users', {
      params: params ,
      signal: controller.signal 
    });
    console.log('getUsers, response: ', response);
    console.log('getUsers, response.data: ', response.data);

    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) 

    console.log('axios.isCancel(err): ',axios.isCancel(err))
    if (axios.isCancel(err)) {
      throw err;
    }
    throw new Error(`Failed to get users for admin: ${err.message}`);
  }
}

export const getUser = async (id: number): Promise<User | undefined> => {
  try {
    const response = await api.get(`/admin/users/${id}`);
    console.log('response: ', response)
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to get user ${id}: ${err.message}`)
    }
  }
}

export const editUser = async (id: number, userRequest: UserRequest): Promise<User | undefined> => {
  try {
    const response = api.put(`/admin/users/${id}`, userRequest);
    return (await response).data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed edit user ${id}: ${err.message}`)
    }
  }
}

export const deleteUser = async (id: number): Promise<void> => {
  try {
    // id = undefined;
    await api.delete(`/admin/users/${id}`)

  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to delete user: ${err.message}`)
    }
  }
} 

export const blockUser = async (id: number): Promise<void> => { //!!! todo: типы Promise<User>
  try {
    console.log("block id: ", id);
    const res = await api.post(`/admin/users/${id}/block`);
    console.log('block res: ', res)
  } catch(err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to block user: ${err.message}`)
    }
  }
}

export const unblockUser = async (id: number): Promise<void> => { //!!! todo: Promise<User>
  try {
    await api.post(`/admin/users/${id}/unblock`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to block user: ${err.message}`)
    }
  }
}


export const changeUserRoles = async (id: number, roles: any): Promise<void> => { //!!!  типы //Promise<User | undefined>
  try {
    const response = await api.post(`/admin/users/${id}/rights`, {roles: roles});
    console.log('changeRightsUser | response.data: ', response.data)
    return response.data;
  } catch(err: unknown) {
    if (err instanceof Error) {
      throw new Error(`Failed to change rights for user ${id}: ${err.message}`);
    }
  }
}