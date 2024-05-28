import { parseRules } from './rules'

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

  it('throws when passed broken regexp pattern', () => {
    expect(() =>
      parseRules(
        '[{"kind": "pr", "rule": "(", "message": "Now pull request issue number reaches **{{prNum}}**. It\'s time to celebrate!"}]'
      )
    ).toThrowError('Invalid rule: (')
  })
})
