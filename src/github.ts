import * as github from '@actions/github'
import type { Octokit } from '@octokit/action'

import type { Comment, MessageContext } from './interfaces'

const COMMENT_MARKER = '<!-- happy-commit -->'

type CommentAction =
  | { type: 'create'; body: string }
  | { type: 'update'; commentId: number; body: string }
  | { type: 'delete'; commentId: number }
  | { type: 'noop' }

function buildManagedBody(body: string): string {
  return `${COMMENT_MARKER}\n${body}`
}

export function decideCommentAction(
  pastComment: Comment | null,
  message: MessageContext
): CommentAction {
  const { lucky, body } = message
  const managedBody = buildManagedBody(body)

  if (lucky) {
    if (!pastComment) {
      return { type: 'create', body: managedBody }
    }
    if (pastComment.body !== managedBody) {
      return {
        type: 'update',
        commentId: pastComment.id,
        body: managedBody,
      }
    }
    return { type: 'noop' }
  }

  if (pastComment) {
    return { type: 'delete', commentId: pastComment.id }
  }

  return { type: 'noop' }
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
export async function updateMessage(
  octokit: Octokit,
  prNum: number,
  userLogin: string,
  message: MessageContext
): Promise<void> {
  const context = github.context
  const pastComment = await getManagedComment(octokit, prNum, userLogin)
  const action = decideCommentAction(pastComment, message)

  switch (action.type) {
    case 'update': {
      await octokit.issues.updateComment({
        ...context.repo,
        comment_id: action.commentId,
        body: action.body,
      })
      return
    }
    case 'create': {
      await octokit.issues.createComment({
        ...context.repo,
        issue_number: prNum,
        body: action.body,
      })
      return
    }
    case 'delete': {
      await octokit.issues.deleteComment({
        ...context.repo,
        comment_id: action.commentId,
      })
      return
    }
    case 'noop':
      return
  }
}

/**
 * Get the managed comment of the current PR by the current user
 * @param octokit {Octokit} the octokit instance
 * @param prNum {number} the PR number
 * @param userLogin {string} the user login name
 * @returns comment id {LastComment}
 */
async function getManagedComment(
  octokit: Octokit,
  prNum: number,
  userLogin: string
): Promise<Comment | null> {
  const context = github.context
  // get comments on the PR
  const comments = await octokit.issues.listComments({
    ...context.repo,
    issue_number: prNum,
  })
  // find the managed comment by the current user if it exists
  for (const comment of comments.data) {
    if (
      comment.user?.login === userLogin &&
      (comment.body || comment.body_text || '').includes(COMMENT_MARKER)
    ) {
      return {
        id: comment.id,
        body: comment.body_text || '',
      }
    }
  }
  return null
}

/**
 * Get commit ids of the current PR
 * @param octokit {Octokit} the octokit instance
 * @returns commit ids {string[]}
 */
export async function getCommitIds(octokit: Octokit): Promise<string[]> {
  const context = github.context
  const commits = await octokit.pulls.listCommits({
    ...context.repo,
    pull_number: context.issue.number,
  })
  return commits.data.map((commit: { sha: string }) => commit.sha)
}

export async function getRepositoryCommitCount(
  octokit: Octokit,
  defaultBranch: string
): Promise<number> {
  interface Result {
    repository: {
      object: {
        history: {
          totalCount: number
        }
      } | null
    } | null
  }

  const context = github.context
  const resp: Result = await octokit.graphql(
    `
query ($owner: String!, $repo: String!, $expression: String!) {
  repository(owner: $owner, name: $repo) {
    object(expression: $expression) {
      ... on Commit {
        history(first: 1) {
          totalCount
        }
      }
    }
  }
}
`,
    {
      owner: context.repo.owner,
      repo: context.repo.repo,
      expression: `refs/heads/${defaultBranch}`,
    }
  )

  const totalCount = resp.repository?.object?.history.totalCount
  if (typeof totalCount !== 'number') {
    throw new Error(`Could not resolve commit count for ${defaultBranch}`)
  }

  return totalCount
}

/**
 * Get login name of the current user
 * By default, this returns `github-actions[bot]`
 * @param octokit {Octokit} the octokit instance
 * @returns user login {string}
 */
export async function getUserLogin(octokit: Octokit) {
  interface Result {
    viewer: {
      login: string
    }
  }
  const resp: Result = await octokit.graphql(`
query {
  viewer {
    login
  }
}`)
  return resp.viewer.login
}
