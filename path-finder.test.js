const pathFinder = require('./path-finder');


describe('Path Finder Test Suite', () => {
  test('Test #1 - "L" Pattern', () => {
    const result = pathFinder('X', 0, [0, 0], [[1, 1, 1], [1, 0, 1], [1, 'X', 1]]);
    const expected = [[0, 0], [1, 0], [2, 0], [2, 1]];

    expect(result.traversals).toBe(3);
    expect(result.path).toEqual(expect.arrayContaining(expected));
  });

  test('Test #2 - "?" shaped pattern', () => {
    const result = pathFinder('X', 0, [7, 0], [['X', 1, 1, 1, 1],
      [1, 1, 1, 0, 1], [0, 0, 1, 0, 1], [1, 1, 1, 0, 1], [1, 0, 1, 0, 1],
      [1, 0, 1, 1, 1], [1, 0, 1, 0, 1], [1, 1, 1, 1, 1]]);
    const expected = [
      [7, 0], [6, 0], [5, 0], [4, 0], [3, 0], [3, 1],
      [3, 2], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0],
    ];

    expect(result.traversals).toBe(11);
    expect(result.path).toEqual(expect.arrayContaining(expected));
  });

  test('Test #3 - Switchback shaped pattern', () => {
    const result = pathFinder('X', 0, [7, 0], [['X', 1, 0, 1, 1], [0, 1, 1, 1, 1], [0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1]]);
    const expected = [
      [7, 0], [7, 1], [7, 2], [7, 3], [7, 4], [6, 4],
      [5, 4], [5, 3], [5, 2], [5, 1], [5, 0], [4, 0],
      [3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [2, 4],
      [1, 4], [1, 3], [1, 2], [1, 1], [0, 1], [0, 0],
    ];

    expect(result.traversals).toBe(23);
    expect(result.path).toEqual(expect.arrayContaining(expected));
  });
});
