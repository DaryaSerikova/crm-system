export const getValidationMessage = (str: string): string => { 
// export const getValidationMessage = (str: string): string | null => { 

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

  // return null;
  return '';
}


export const getValidationMessageAntd = (value: string): Promise => {  // промисс string или без аргумента
  // // export const getValidationMessageAntd = (str: string): Promise<string> => { 
  
  const validationMessage = getValidationMessage(value);

  if (validationMessage !== '') {
    return Promise.reject(new Error(validationMessage));
  }
  return Promise.resolve();
  
//     // return null;
//     // return Promise.resolve('');
//     return Promise.resolve(); // здесь нет аргумента в промисе
  }