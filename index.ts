import * as core from "@actions/core";
import * as github from "@actions/github";
import { Octokit } from "@octokit/action";

async function run() {
  try {
    const context = github.context;
    const octokit = new Octokit();
    const userLogin = await getUserLogin(octokit);
    const prNum = context.issue.number;
    const commitIds = await getCommitIds(octokit);
    const message = buildMessage({ commitIds, prNum });
    await updateMessage(octokit, prNum, userLogin, message);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

interface MessageContext {
  lucky: boolean;
  body: string;
}

interface Comment {
  id: number;
  body: string;
}

interface LuckyJudgeContext {
  commitIds: string[];
  prNum: number;
}

function buildMessage(context: LuckyJudgeContext): MessageContext {
  const { commitIds, prNum } = context;
  const messages = [];
  let lucky = false;

  if (isEveryDigit7(prNum) || isLuckyNumberBase10(prNum)) {
    messages.push(`- Now pull request issue number reaches **${prNum}**. It's time to celebrate!`);
    lucky = true;
  }

  for (const commitId of commitIds) {
    const result = checkLuckyCommitId(commitId);
    if (result.lucky) {
      messages.push(`- Commit \`${commitId}\` is lucky! It contains **${result.match}**!.`);
      lucky = true;
    }
  }
  if (lucky) {
    return {
      lucky,
      body: "# :tada: Lucky commit!\n" + messages.join("\n"),
    };
  }
  return {
    lucky: false,
    body: "",
  }
}

interface LuckyCommitResult {
  lucky: boolean;
  match: string;
}

/**
 * check if the commit id is lucky
 * @param commitId {string} the commit id
 * @returns {LuckyCommitResult}
 */
function checkLuckyCommitId(commitId: string): LuckyCommitResult {
  const match = commitId.match(/(7{2,})/);
  if (match) {
    return {
      lucky: true,
      match: match[0],
    };
  }
  return {
    lucky: false,
    match: "",
  };
}

/**
 * 77, 777, ... is lucky number
 * @param num {number} the number to be checked
 * @returns {boolean} true if the number is lucky
 */
function isEveryDigit7(num: number): boolean {
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
function isLuckyNumberBase10(num: number): boolean {
  if (num.toString().match(/^[1]0+$/)) {
    return true;
  }
  return false;
}

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
async function updateMessage(
  octokit: Octokit,
  prNum: number,
  userLogin: string,
  message: MessageContext
): Promise<void> {
  const context = github.context;
  const pastComment = await getFirstComment(octokit, prNum, userLogin);

  const { lucky, body } = message;
  if (lucky) {
    // if there is a comment from the current user and the message is different, update it
    if (pastComment && pastComment.body !== body) {
      await octokit.issues.updateComment({
        ...context.repo,
        comment_id: pastComment.id,
        body,
      });
    } else {
      // if there is no comment from the current user, create it
      await octokit.issues.createComment({
        ...context.repo,
        issue_number: prNum,
        body,
      });
    }
  } else {
    // if there is a comment from the current user, delete it
    if (pastComment) {
      await octokit.issues.deleteComment({
        ...context.repo,
        comment_id: pastComment.id,
      });
    }
  }
}

/**
 * Get the first comment of the current PR by the current user
 * @param octokit {Octokit} the octokit instance
 * @param prNum {number} the PR number
 * @param userLogin {string} the user login name
 * @returns comment id {LastComment}
 */
async function getFirstComment(
  octokit: Octokit,
  prNum: number,
  userLogin: string
): Promise<Comment | null> {
  const context = github.context;
  // get comments on the PR
  const comments = await octokit.issues.listComments({
    ...context.repo,
    issue_number: prNum,
  });
  // find the comment by the current user if it exists
  for (const comment of comments.data) {
    if (comment.user?.login === userLogin) {
      return {
        id: comment.id,
        body: comment.body_text || "",
      };
    }
  }
  return null;
}

/**
 * Get commit ids of the current PR
 * @param octokit {Octokit} the octokit instance
 * @returns commit ids {string[]}
 */
async function getCommitIds(octokit: Octokit): Promise<string[]> {
  const context = github.context;
  const commits = await octokit.pulls.listCommits({
    ...context.repo,
    pull_number: context.issue.number,
  });
  return commits.data.map((commit) => commit.sha);
}

/**
 * Get login name of the current user
 * By default, this returns `github-actions[bot]`
 * @param octokit {Octokit} the octokit instance
 * @returns user login {string}
 */
async function getUserLogin(octokit: Octokit) {
  const resp: any = await octokit.graphql(`
query {
  viewer {
    login
  }
}`);
  return resp.viewer.login;
}

if (require.main === module) {
  run().then(() => {});
}
