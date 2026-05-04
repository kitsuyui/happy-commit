import { describe, expect, it } from 'vitest'

import { parseRules, Rules } from './rules'

describe('parseRules', () => {
  it('can parse when passed valid json', () => {
    const rules = parseRules(
      '[{"kind": "pr", "rule": "(?:[1]0+)", "message": "Now pull request issue number reaches **{{prNum}}**. It\'s time to celebrate!"}]'
    )
    expect(rules).toEqual([
      {
        kind: 'pr',
        rule: /(?:[1]0+)/,
        message:
          "Now pull request issue number reaches **{{prNum}}**. It's time to celebrate!",
      },
    ])
  })

  it('throws when passed invalid json', () => {
    expect(() => parseRules('invalid json')).toThrowError('Invalid JSON')
  })

  it('throws when passed invalid rules', () => {
    expect(() =>
      parseRules(
        '[{"kind": "something", "rule": "(?:[1]0+)", "message": "Now pull request issue number reaches **{{prNum}}**. It\'s time to celebrate!"}]'
      )
    ).toThrowError('Invalid rules')
  })

  it('throws when passed rules missing required fields', () => {
    expect(() =>
      parseRules(
        '[{"rule": "(?:[1]0+)", "message": "Now pull request issue number reaches **{{prNum}}**. It\'s time to celebrate!"}]'
      )
    ).toThrowError('Invalid rules')

    expect(() =>
      parseRules(
        '[{"kind": "pr", "message": "Now pull request issue number reaches **{{prNum}}**. It\'s time to celebrate!"}]'
      )
    ).toThrowError('Invalid rules')

    expect(() =>
      parseRules('[{"kind": "pr", "rule": "(?:[1]0+)"}]')
    ).toThrowError('Invalid rules')
  })

  it('throws when passed broken regexp pattern', () => {
    expect(() =>
      parseRules(
        '[{"kind": "pr", "rule": "(", "message": "Now pull request issue number reaches **{{prNum}}**. It\'s time to celebrate!"}]'
      )
    ).toThrowError('Invalid rule: (')
  })

  it('exposes expected-occurrence calculators for built-in rarity gating', () => {
    expect(
      Rules.pr_reaches_power_of_2.expectedOccurrences?.({
        commitIds: [],
        prNum: 4096,
        repositoryCommitCount: 0,
      })
    ).toBe(4)

    expect(
      Rules.commit_hits_same_numbers.expectedOccurrences?.({
        commitIds: [],
        prNum: 1,
        repositoryCommitCount: 1000,
      })
    ).toBeGreaterThan(0)

    expect(
      Rules.commit_hits_hexspeak.expectedOccurrences?.({
        commitIds: [],
        prNum: 1,
        repositoryCommitCount: 1000,
      })
    ).toBeGreaterThan(0)
  })
})
