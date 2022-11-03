import * as index from './index';

describe('1 + 1 == 2', () => {
  it('should be true', () => {
    expect(1 + 1).toBe(2);
  });
});

describe('isEveryDigit7', () => {
  it('should be lucky', () => {
    const result = index.isEveryDigit7(777);
    expect(result).toBe(true);
  });

  it('should not be lucky', () => {
    expect(index.isEveryDigit7(778)).toBe(false);
    expect(index.isEveryDigit7(666)).toBe(false);
  });
});

describe('isLuckyNumberBase10', () => {
  it('should be lucky', () => {
    expect(index.isLuckyNumberBase10(10)).toBe(true);
    expect(index.isLuckyNumberBase10(100)).toBe(true);
    expect(index.isLuckyNumberBase10(1000)).toBe(true);
  });

  it('should not be lucky', () => {
    expect(index.isLuckyNumberBase10(11)).toBe(false);
    expect(index.isLuckyNumberBase10(101)).toBe(false);
    expect(index.isLuckyNumberBase10(1001)).toBe(false);
  });
});
