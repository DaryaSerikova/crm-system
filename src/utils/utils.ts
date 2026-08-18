import type { Params, User } from "@/types/admin.types";
import type { SetStateAction } from "react";

export const getValidationMessage = (str: string): string => {

  const MIN_CHARACTERS_NUMBER = 2;
  const MAX_CHARACTERS_NUMBER = 64;

  str = str.trim();

  if (str.length === 0) {
    return "Поле не может быть пустым!";
  }
  if (str.length < MIN_CHARACTERS_NUMBER ) {
    return "Cимволов не может быть менее 2";
  }
  if (str.length > MAX_CHARACTERS_NUMBER ) {
    return "Cимволов не может быть более 64";
  }

  return '';
}

export const getHumanDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    // hour: '2-digit',
    // minute: '2-digit',
  })
}

export const getHumanPhone = (phone: string) => 
  phone 
    ? `${phone.slice(0,2)} (${phone.slice(2,5)}) ${phone.slice(5,8)}-${phone.slice(8)}`
    : '';

export const getClearAllValues = (params: Params) => { //!!! типизировать
  const result: Partial<Record<keyof Params, Params[keyof Params]>> = {};
  // const result: Params = {};
  
  
  for (let [key, value] of Object.entries(params)) {
    const paramKey = key as keyof Params;

    switch (paramKey) {
      case 'search':
      case 'sortBy':
      case 'sortOrder':
        if (typeof value === 'string') {
          const isExist = !!value.trim();
          if (isExist) {
            result[paramKey] = value;
          }
        }
        break;

      case 'isBlocked':
        if (typeof value === 'boolean') {
          result[paramKey] = value;
        }
        break;

      case 'limit':
      case 'page':
        if (typeof value === 'number') {
          result[paramKey] = value;
        }
        break;
      
      default: 
        return;
    }
  
    // if (paramKey !== 'isBlocked' && typeof value === 'string'  && !!value?.trim()) {
    //   result[paramKey] = value?.trim();
    // }
    // if (paramKey === 'isBlocked' && typeof value === 'boolean') {
    //   result[paramKey] = value;
    // }
    // if (typeof value === 'number') {
    //   result[paramKey] = value;
    // }
  }

  return result as Params;
}

export const deleteIdFromRoles = (
  user: User, currentIds: number[], setCurrentIds: React.Dispatch<SetStateAction<number[]>>
) => {
  const userIndex = currentIds.indexOf(user.id);
  setCurrentIds([
    ...currentIds.slice(0, userIndex),
    ...currentIds.slice(userIndex + 1) 
  ])
}