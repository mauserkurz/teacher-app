/**
* uniqueValue - function for filtering array and left only unique values by linear time
* @param array - is just array with any values
* @return T - filtered array with same type like argument array
* */

export function uniqueValue (array: any[]): any[] {
  const seen = {};

  return array.filter (
    value => seen.hasOwnProperty (value) ? false : (seen[ value ] = true)
  );
}
