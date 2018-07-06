/**
 * Pass a formula and an object with values to evaluate the strings after replacing the variables.
 * Examples formulas are:
 *  * 10 + 10 => 20
 *  * amount * 10 => will check the 'values' parameter object for an 'amount' key and use the value to replace it and evaluate the string.
 *  * (amount|0| * 12) + 1.95 => will check the 'values' parameter object for an 'amount' key and use the value to replace it and evaluate the string. If the 'amount' key is not present it will use '0' instead.
 * @param formula The formula needs to be a string and can contain the basic mathematical operators, i.e. + - * / () ^
 * @param values Object with the keys corresponding to the variables in the formula and with values to be used instead of the variables.
 * @returns number
 */
// eslint-disable-next-line import/prefer-default-export
export const parse = (formula, values) => {
  const formattedFormula = formula.replace(/\|([0-9]+)\|/g, ''); // Remove all fallback values from formula (|1|)

  const formulaParts = formula.split('|'); // Split formula into parts, an array of fields & fallback values ('field|1| + field2|0|' => ['field', 1, 'field2', 0])

  const replacedFormula = formattedFormula.match(/([a-zA-Z_])+/g).reduce((result, variable) => {
    let value = values[variable];
    if(typeof value === 'undefined') {
      const fallbackIndex = formulaParts.findIndex(item => item.endsWith(variable)); // Get index of field in formula parts
      const fallbackValue = parseFloat(formulaParts[fallbackIndex + 1]); // Next to field is the fallback value, hence the + 1
      if(fallbackIndex !== false && !isNaN(fallbackValue)) { // If the fallback value exists, and is a number
        value = fallbackValue;
      }
    }

    return result.replace(variable, value);
  }, formattedFormula);

  if(replacedFormula.match(/[^-()\d\s/*+.]/g)) {
    throw new Error(`Invalid characters found in formula ${replacedFormula.toString()}`);
  }

  // eslint-disable-next-line no-eval
  return eval(replacedFormula);
};
