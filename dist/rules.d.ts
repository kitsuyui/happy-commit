import { LuckyCommitResult } from './interfaces';
/**
 * 77, 777, ... is lucky number
 * @param num {number} the number to be checked
 * @returns {boolean} true if the number is lucky
 */
export declare function isEveryDigit7(num: number): boolean;
/**
 * 10, 100, 1000, ... is lucky number
 * @param num {number} the number to be checked
 * @returns {boolean} true if the number is lucky
 */
export declare function isLuckyNumberBase10(num: number): boolean;
/**
 * check if the commit id is lucky
 * @param commitId {string} the commit id
 * @returns {LuckyCommitResult}
 */
export declare function checkLuckyCommitId(commitId: string): LuckyCommitResult;
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist