export const getValidationMessage = (str: string) => { 
  if (str.length === 0) {
    return "Поле не может быть пустым!";
  }
  if (str.length < 2 ) {
    return "Cимволов не может быть менее 2";
  }
  if (str.length > 64 ) {
    return "Cимволов не может быть более 64";
  }

  return null;
}


// export const getValidationMessage = (str: string) => { //Быстрый выход, Return Early Pattern 
//   if (str.length === 0) return "Поле не может быть пустым!";
//   else {
//     if (str.length < 2 ) return "Cимволов не может быть менее 2"
//     if (str.length > 64 ) return "Cимволов не может быть более 64"
//   }
//   return null;
//   // return {isValid: true, message: null};
// }