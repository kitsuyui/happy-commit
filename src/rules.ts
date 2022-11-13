import { LuckyCommitResult } from './interfaces';

/**
 * 77, 777, ... is lucky number
 * @param num {number} the number to be checked
 * @returns {boolean} true if the number is lucky
 */
export function isEveryDigit7(num: number): boolean {
  if (num.toString().match(/^7{2,}$/)) {
    return true;
  }
  return false;
}

/**
 * 10, 100, 1000, ... is lucky number
 * @param num {number} the number to be checked
 * @returns {boolean} true if the number is lucky
 */
export function isLuckyNumberBase10(num: number): boolean {
  if (num.toString().match(/^[1]0+$/)) {
    return true;
  }
  return false;
}

/**
 * check if the commit id is lucky
 * @param commitId {string} the commit id
 * @returns {LuckyCommitResult}
 */
export function checkLuckyCommitId(commitId: string): LuckyCommitResult {
  const match = commitId.match(/(7{3,})/);
  if (match) {
    return {
      lucky: true,
      match: match[0],
    };
  }
  return {
    lucky: false,
    match: '',
  };
}
