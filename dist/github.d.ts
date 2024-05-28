import type { Octokit } from '@octokit/action';
import type { MessageContext } from './interfaces';
/**
 * Update the comment of the current PR
 * if lucky and past comment does not exist, create it.
 * if lucky and past comment exists, update it.
 * if not lucky, delete the comment.
 *
 * @param octokit {Octokit} the octokit instance
 * @param prNum {number} the PR number
 * @param userLogin {string} the user login name
 * @param message {MessageContext} the message context
 */
export declare function updateMessage(octokit: Octokit, prNum: number, userLogin: string, message: MessageContext): Promise<void>;
/**
 * Get commit ids of the current PR
 * @param octokit {Octokit} the octokit instance
 * @returns commit ids {string[]}
 */
export declare function getCommitIds(octokit: Octokit): Promise<string[]>;
/**
 * Get login name of the current user
 * By default, this returns `github-actions[bot]`
 * @param octokit {Octokit} the octokit instance
 * @returns user login {string}
 */
export declare function getUserLogin(octokit: Octokit): Promise<string>;
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist