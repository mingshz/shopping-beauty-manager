import { getCurrent } from './manager';

describe('演示', () => {
  it('example', () => {
    return getCurrent().then((result) => {
      console.log(result);
    });
  });
});
