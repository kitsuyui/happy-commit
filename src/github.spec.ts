import { beforeEach, describe, expect, it, vi } from 'vitest'

const { githubContext } = vi.hoisted(() => ({
  githubContext: {
    repo: {
      owner: 'kitsuyui',
      repo: 'happy-commit',
    },
    issue: {
      number: 123,
    },
  },
}))

vi.mock('@actions/github', () => ({
  context: githubContext,
}))

import {
  decideCommentAction,
  getCommitIds,
  getRepositoryCommitCount,
  getUserLogin,
  updateMessage,
} from './github'

function createOctokitMock() {
  return {
    issues: {
      listComments: vi.fn(),
      updateComment: vi.fn(),
      createComment: vi.fn(),
      deleteComment: vi.fn(),
    },
    pulls: {
      listCommits: vi.fn(),
    },
    graphql: vi.fn(),
  }
}

describe('decideCommentAction', () => {
  it('creates a comment when message is lucky and no past comment exists', () => {
    expect(
      decideCommentAction(null, {
        lucky: true,
        body: 'hello',
      })
    ).toEqual({
      type: 'create',
      body: '<!-- happy-commit -->\nhello',
    })
  })

  it('updates a comment when message body changed', () => {
    expect(
      decideCommentAction(
        {
          id: 1,
          body: 'old',
        },
        {
          lucky: true,
          body: 'new',
        }
      )
    ).toEqual({
      type: 'update',
      commentId: 1,
      body: '<!-- happy-commit -->\nnew',
    })
  })

  it('does nothing when message body is unchanged', () => {
    expect(
      decideCommentAction(
        {
          id: 1,
          body: '<!-- happy-commit -->\nsame',
        },
        {
          lucky: true,
          body: 'same',
        }
      )
    ).toEqual({
      type: 'noop',
    })
  })

  it('deletes a past comment when message is no longer lucky', () => {
    expect(
      decideCommentAction(
        {
          id: 1,
          body: 'same',
        },
        {
          lucky: false,
          body: '',
        }
      )
    ).toEqual({
      type: 'delete',
      commentId: 1,
    })
  })

  it('does nothing when there is nothing to delete', () => {
    expect(
      decideCommentAction(null, {
        lucky: false,
        body: '',
      })
    ).toEqual({
      type: 'noop',
    })
  })
})

describe('updateMessage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a comment when no previous comment exists', async () => {
    const octokit = createOctokitMock()
    octokit.issues.listComments.mockResolvedValue({ data: [] })

    await updateMessage(octokit as never, 123, 'github-actions[bot]', {
      lucky: true,
      body: 'new body',
    })

    expect(octokit.issues.listComments).toHaveBeenCalledWith({
      owner: 'kitsuyui',
      repo: 'happy-commit',
      issue_number: 123,
    })
    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      owner: 'kitsuyui',
      repo: 'happy-commit',
      issue_number: 123,
      body: '<!-- happy-commit -->\nnew body',
    })
    expect(octokit.issues.updateComment).not.toHaveBeenCalled()
    expect(octokit.issues.deleteComment).not.toHaveBeenCalled()
  })

  it('updates a comment when the rendered body changed', async () => {
    const octokit = createOctokitMock()
    octokit.issues.listComments.mockResolvedValue({
      data: [
        {
          id: 55,
          body_text: '<!-- happy-commit -->\nold body',
          body: '<!-- happy-commit -->\nold body',
          user: { login: 'github-actions[bot]' },
        },
      ],
    })

    await updateMessage(octokit as never, 123, 'github-actions[bot]', {
      lucky: true,
      body: 'new body',
    })

    expect(octokit.issues.updateComment).toHaveBeenCalledWith({
      owner: 'kitsuyui',
      repo: 'happy-commit',
      comment_id: 55,
      body: '<!-- happy-commit -->\nnew body',
    })
    expect(octokit.issues.createComment).not.toHaveBeenCalled()
    expect(octokit.issues.deleteComment).not.toHaveBeenCalled()
  })

  it('keeps the existing comment when the body is unchanged', async () => {
    const octokit = createOctokitMock()
    octokit.issues.listComments.mockResolvedValue({
      data: [
        {
          id: 55,
          body_text: '<!-- happy-commit -->\nsame body',
          body: '<!-- happy-commit -->\nsame body',
          user: { login: 'github-actions[bot]' },
        },
      ],
    })

    await updateMessage(octokit as never, 123, 'github-actions[bot]', {
      lucky: true,
      body: 'same body',
    })

    expect(octokit.issues.createComment).not.toHaveBeenCalled()
    expect(octokit.issues.updateComment).not.toHaveBeenCalled()
    expect(octokit.issues.deleteComment).not.toHaveBeenCalled()
  })

  it('deletes an existing comment when the message is no longer lucky', async () => {
    const octokit = createOctokitMock()
    octokit.issues.listComments.mockResolvedValue({
      data: [
        {
          id: 55,
          body_text: '<!-- happy-commit -->\nsame body',
          body: '<!-- happy-commit -->\nsame body',
          user: { login: 'github-actions[bot]' },
        },
      ],
    })

    await updateMessage(octokit as never, 123, 'github-actions[bot]', {
      lucky: false,
      body: '',
    })

    expect(octokit.issues.deleteComment).toHaveBeenCalledWith({
      owner: 'kitsuyui',
      repo: 'happy-commit',
      comment_id: 55,
    })
  })

  it('ignores comments from other users and falls back to create', async () => {
    const octokit = createOctokitMock()
    octokit.issues.listComments.mockResolvedValue({
      data: [
        {
          id: 10,
          body_text: 'other body',
          user: { login: 'someone-else' },
        },
        {
          id: 11,
          body_text: '<!-- happy-commit -->\nstale body',
          body: '<!-- happy-commit -->\nstale body',
          user: { login: 'github-actions[bot]' },
        },
      ],
    })

    await updateMessage(octokit as never, 123, 'missing-user', {
      lucky: true,
      body: 'fresh body',
    })

    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      owner: 'kitsuyui',
      repo: 'happy-commit',
      issue_number: 123,
      body: '<!-- happy-commit -->\nfresh body',
    })
  })

  it('ignores unrelated comments from the same user and creates a managed comment', async () => {
    const octokit = createOctokitMock()
    octokit.issues.listComments.mockResolvedValue({
      data: [
        {
          id: 12,
          body_text: 'plain comment',
          body: 'plain comment',
          user: { login: 'github-actions[bot]' },
        },
      ],
    })

    await updateMessage(octokit as never, 123, 'github-actions[bot]', {
      lucky: true,
      body: 'fresh body',
    })

    expect(octokit.issues.createComment).toHaveBeenCalledWith({
      owner: 'kitsuyui',
      repo: 'happy-commit',
      issue_number: 123,
      body: '<!-- happy-commit -->\nfresh body',
    })
    expect(octokit.issues.updateComment).not.toHaveBeenCalled()
  })
})

describe('github helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns commit ids from the current pull request', async () => {
    const octokit = createOctokitMock()
    octokit.pulls.listCommits.mockResolvedValue({
      data: [{ sha: 'aaa' }, { sha: 'bbb' }],
    })

    await expect(getCommitIds(octokit as never)).resolves.toEqual([
      'aaa',
      'bbb',
    ])
    expect(octokit.pulls.listCommits).toHaveBeenCalledWith({
      owner: 'kitsuyui',
      repo: 'happy-commit',
      pull_number: 123,
    })
  })

  it('returns the current user login from graphql', async () => {
    const octokit = createOctokitMock()
    octokit.graphql.mockResolvedValue({
      viewer: {
        login: 'github-actions[bot]',
      },
    })

    await expect(getUserLogin(octokit as never)).resolves.toBe(
      'github-actions[bot]'
    )
    expect(octokit.graphql).toHaveBeenCalledOnce()
  })

  it('returns the repository commit count from graphql', async () => {
    const octokit = createOctokitMock()
    octokit.graphql.mockResolvedValue({
      repository: {
        object: {
          history: {
            totalCount: 4321,
          },
        },
      },
    })

    await expect(
      getRepositoryCommitCount(octokit as never, 'main')
    ).resolves.toBe(4321)
    expect(octokit.graphql).toHaveBeenCalledWith(
      expect.stringContaining('history(first: 1)'),
      {
        owner: 'kitsuyui',
        repo: 'happy-commit',
        expression: 'refs/heads/main',
      }
    )
  })
})
