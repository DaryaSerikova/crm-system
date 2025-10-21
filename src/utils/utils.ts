export const getValidationMessage = (str: string): string | null => { 
  //Быстрый выход, Return Early Pattern
  //Антипатерн магические числа
  //можно вернуть '' и сузить типизацию до string

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

  return null;
}