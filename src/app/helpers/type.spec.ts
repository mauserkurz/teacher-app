import { type } from './type';

describe('Helpers: Type', () => {
  const testType = 'Test action 1';
  it ('should check type and return argument string', () => {
    expect(type (testType)).toEqual(testType);
  });

  it ('should find same type and throw error', () => {
     expect(_ => type (testType)).toThrowError(`Action type "${testType}" is not unique`);
  });
});
