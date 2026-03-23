import { describe, expect, it } from 'vitest'

import { decideCommentAction } from './github'

describe('decideCommentAction', () => {
  it('creates a comment when message is lucky and no past comment exists', () => {
    expect(
      decideCommentAction(null, {
        lucky: true,
        body: 'hello',
      })
    ).toEqual({
      type: 'create',
      body: 'hello',
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
      body: 'new',
    })
  })

  it('does nothing when message body is unchanged', () => {
    expect(
      decideCommentAction(
        {
          id: 1,
          body: 'same',
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
