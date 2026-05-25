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

function createLuckyCommentAction(
  pastComment: Comment | null,
  managedBody: string
): CommentAction {
  if (!pastComment) {
    return { type: 'create', body: managedBody }
  }
  if (pastComment.body === managedBody) {
    return { type: 'noop' }
  }
  return {
    type: 'update',
    commentId: pastComment.id,
    body: managedBody,
  }
}

export function decideCommentAction(
  pastComment: Comment | null,
  message: MessageContext
): CommentAction {
  if (!message.lucky) {
    return pastComment
      ? { type: 'delete', commentId: pastComment.id }
      : { type: 'noop' }
  }

  return createLuckyCommentAction(pastComment, buildManagedBody(message.body))
}

/**
 * Delete all but the last managed comment, returning the surviving comment.
 * This cleans up duplicates created by concurrent Action runs.
 */
async function deduplicateManagedComments(
  octokit: Octokit,
  prNum: number,
  userLogin: string
): Promise<Comment | null> {
  const context = github.context
  const all = await getAllManagedComments(octokit, prNum, userLogin)
  for (const dup of all.slice(0, -1)) {
    await octokit.issues.deleteComment({
      ...context.repo,
      comment_id: dup.id,
    })
  }
  return all.length > 0 ? all[all.length - 1] : null
}

/**
 * Update the comment of the current PR
 * if lucky and past comment does not exist, create it.
 * if lucky and past comment exists, update it.
 * if not lucky, delete the comment.
 *
 * When multiple managed comments exist (e.g. left by concurrent runs that
 * both saw no comment and both called createComment), this function keeps
 * only the most-recently-created one and deletes the extras.  The
 * deduplication runs both on the initial fetch and after a create so that
 * stale comments accumulated by previous races are cleaned up eagerly.
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
  const pastComment = await deduplicateManagedComments(
    octokit,
    prNum,
    userLogin
  )
  const action = decideCommentAction(pastComment, message)
  await applyCommentAction(octokit, prNum, userLogin, action)
}

async function applyCommentAction(
  octokit: Octokit,
  prNum: number,
  userLogin: string,
  action: CommentAction
): Promise<void> {
  const context = github.context
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
      // After create, re-fetch to clean up any duplicate that a concurrent
      // run may have created in the same window.
      await deduplicateManagedComments(octokit, prNum, userLogin)
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

async function listAllComments(
  octokit: Octokit,
  prNum: number
): Promise<Awaited<ReturnType<typeof octokit.issues.listComments>>['data']> {
  const context = github.context
  const all: Awaited<ReturnType<typeof octokit.issues.listComments>>['data'] =
    []
  let page = 1
  let hasMore = true
  while (hasMore) {
    const { data } = await octokit.issues.listComments({
      ...context.repo,
      issue_number: prNum,
      per_page: 100,
      page,
    })
    all.push(...data)
    hasMore = data.length >= 100
    page++
  }
  return all
}

/**
 * Return ALL managed comments on the PR posted by userLogin, sorted by id
 * ascending (oldest first).  Most callers need only one comment, but
 * returning all of them lets updateMessage detect and remove duplicates
 * created by concurrent Action runs.
 *
 * @param octokit {Octokit} the octokit instance
 * @param prNum {number} the PR number
 * @param userLogin {string} the user login name
 * @returns all managed comments sorted by id ascending
 */
async function getAllManagedComments(
  octokit: Octokit,
  prNum: number,
  userLogin: string
): Promise<Comment[]> {
  const allComments = await listAllComments(octokit, prNum)
  return allComments
    .filter((candidate) => isManagedCommentByUser(candidate, userLogin))
    .map((c) => ({ id: c.id, body: c.body || c.body_text || '' }))
    .sort((a, b) => a.id - b.id)
}

function isManagedCommentByUser(
  comment: {
    user?: { login?: string | null } | null
    body?: string | null
    body_text?: string | null
  },
  userLogin: string
): boolean {
  return (
    comment.user?.login === userLogin &&
    (comment.body || comment.body_text || '').includes(COMMENT_MARKER)
  )
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
        } | null
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

  const totalCount = resp.repository?.object?.history?.totalCount
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
      login: string | null
    } | null
  }
  const resp: Result = await octokit.graphql(`
query {
  viewer {
    login
  }
}`)
  const login = resp.viewer?.login
  if (typeof login !== 'string' || login.length === 0) {
    throw new Error('Could not resolve current user login')
  }
  return login
}
