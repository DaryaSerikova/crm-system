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