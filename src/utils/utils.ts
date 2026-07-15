import type { Params } from "@/types/admin.types";

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
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getClearAllValues = (params: Params) => { //!!! типизировать
  const result: Params = {};
  for (let [key, value] of Object.entries(params) as [keyof Params, Params[keyof Params]][] ) {
    if (typeof value === 'string' && !!value?.trim()) {
      result[key] = value?.trim() as Params[keyof Params];
    }
  }

  return result;
}