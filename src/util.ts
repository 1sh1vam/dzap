export const isStrValidNumber = (str: string) => {
    // Use a regular expression to check if the string is a valid number
    return /^-?\d+(\.\d+)?$/.test(str);
  }