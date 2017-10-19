import { uniqueValue } from './unique_values';

describe('Helper: uniqueValue function', () => {
  it ('should filter array of numbers and return new array with unique numbers', () => {
    const initialArray = [ 0, 1, 2, 2, 3, 3, 4, 5, ];
    const arrayWithUniqueValues = [ 0, 1, 2, 3, 4, 5 ];

    expect(uniqueValue (initialArray)).toEqual(arrayWithUniqueValues);
  });
});
