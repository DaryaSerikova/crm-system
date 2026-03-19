export const getValidationMessage = (str: string): string => {

  const MIN_CHARACTERS_NUMBER = 2;
  const MAX_CHARACTERS_NUMBER = 64;

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


export const getValidationMessageAntd = (value: string): Promise<void> => {

  const validationMessage = getValidationMessage(value);

  if (validationMessage !== '') {
    return Promise.reject(new Error(validationMessage));
  }
  return Promise.resolve(); // здесь нет аргумента в промисе
  }