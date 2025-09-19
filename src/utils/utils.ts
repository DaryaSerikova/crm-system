export const getValidation = (str: string) => {
  if (str.length === 0) return {isValid: false, message: "Поле не может быть пустым!"};
  else {
    const regexp = new RegExp("^.{2,64}$", "g");
    const result = regexp.test(str);
    if (!result) {
      if (str.length < 2 ) return {isValid: false, message: "Cимволов не может быть менее 2"}
      if (str.length > 64 ) return {isValid: false, message: "Cимволов не может быть более 64"}
    }
  }
  return {isValid: true, message: null};
}