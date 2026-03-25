import { describe, expect, it } from 'vitest'

import { CustomMessageBuilder } from './message_builder'

describe('MessageBuilder', () => {
  it('builds congratulatory message when inputs lucky commit ids', () => {
    const context = {
      commitIds: [
        '4a86968b837366e6603cab1142462c8f33ea5fa3',
        '1234567894a86968b837366e6603cab114a86968',
        '7774a86968b837366e6603cab1142462c8f33ea5',
        '6664a86968b837366e6603cab1142462c8f33ea5',
      ],
      prNum: 10000,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )
    const message = mb.build(context)
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        `- Now pull request issue number reaches **10000**. It's time to celebrate!`,
        '- Commit `7774a86968b837366e6603cab1142462c8f33ea5` is lucky! It contains **777**!.',
        '- Commit `1234567894a86968b837366e6603cab114a86968` is lucky! It contains **123456789**!.',
        '- Commit `6664a86968b837366e6603cab1142462c8f33ea5` is unlucky... It contains **666**!.',
        '',
      ].join('\n'),
    })
  })

  it('builds congratulatory message when inputs lucky pull request id', () => {
    const context = {
      commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 777,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )
    const message = mb.build(context)
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        `- Now pull request issue number reaches **777** (777). It's time to celebrate!`,
        '',
      ].join('\n'),
    })
  })

  it('celebrates only all-seven pull request numbers around 777x', () => {
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )

    expect(
      mb.build({
        commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
        prNum: 7776,
      })
    ).toEqual({
      lucky: false,
      body: '# :tada: Happy commit!\n',
    })

    expect(
      mb.build({
        commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
        prNum: 7777,
      })
    ).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        `- Now pull request issue number reaches **7777** (777). It's time to celebrate!`,
        '',
      ].join('\n'),
    })

    expect(
      mb.build({
        commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
        prNum: 7778,
      })
    ).toEqual({
      lucky: false,
      body: '# :tada: Happy commit!\n',
    })
  })

  it('congratulates when pull request id is lucky', () => {
    const context = {
      commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 2000,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )
    const message = mb.build(context)
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        `- Now pull request issue number reaches **2000**. It's time to celebrate!`,
        '',
      ].join('\n'),
    })
  })

  it('skips congratulatory message when it is not lucky', () => {
    const context = {
      commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 410,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )
    const message = mb.build(context)
    expect(message).toEqual({
      lucky: false,
      body: '# :tada: Happy commit!\n',
    })
  })

  it('test_regression_1', () => {
    // https://github.com/kitsuyui/happy-commit/issues/17
    const context = {
      commitIds: [
        'ffd063a5a43ec1239587a76966348dde07ac6fc3',
        'ffd063a5a43ec1234587a76966348dde07ac6fc3',
      ],
      prNum: 5432,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )
    const message = mb.build(context)
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        '- Commit `ffd063a5a43ec1239587a76966348dde07ac6fc3` is lucky! It contains **123**!.',
        '- Commit `ffd063a5a43ec1234587a76966348dde07ac6fc3` is lucky! It contains **12345**!.',
        '',
      ].join('\n'),
    })
  })

  it('celebrates only contiguous 777 runs in commit ids', () => {
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )

    expect(
      mb.build({
        commitIds: ['7a7b7c4d5e6f0123456789abcdefabcd12345678'],
        prNum: 5432,
      })
    ).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        '- Commit `7a7b7c4d5e6f0123456789abcdefabcd12345678` is lucky! It contains **123456789**!.',
        '',
      ].join('\n'),
    })

    expect(
      mb.build({
        commitIds: ['abc777def0123456789abcdefabcd1234567890'],
        prNum: 5432,
      })
    ).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        '- Commit `abc777def0123456789abcdefabcd1234567890` is lucky! It contains **777**!.',
        '- Commit `abc777def0123456789abcdefabcd1234567890` is lucky! It contains **123456789**!.',
        '',
      ].join('\n'),
    })
  })

  it('test_regression_2', () => {
    // https://github.com/kitsuyui/happy-commit/issues/21
    const context = {
      commitIds: ['04ec9392717ce635b916216a455eed945ccf2a49'],
      prNum: 10,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )
    const message = mb.build(context)
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        "- Now pull request issue number reaches **10**. It's time to celebrate!",
        '',
      ].join('\n'),
    })
  })

  it('allows disabling built-in rules through overrides', () => {
    const context = {
      commitIds: ['7774a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 777,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {
        pr_reaches_777: false,
        commit_hits_777: false,
      }
    )
    const message = mb.build(context)

    expect(message).toEqual({
      lucky: false,
      body: '# :tada: Happy commit!\n',
    })
  })

  it('filters built-in rules by expected occurrences when a ceiling is set', () => {
    const context = {
      commitIds: ['7774a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 10000,
      repositoryCommitCount: 1000,
      maxExpectedOccurrences: 1,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )
    const message = mb.build(context)

    expect(message).toEqual({
      lucky: false,
      body: '# :tada: Happy commit!\n',
    })
  })

  it('changes commit celebrations when repository size crosses the ceiling', () => {
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {}
    )

    expect(
      mb.build({
        commitIds: ['7774a86968b837366e6603cab1142462c8f33ea5'],
        prNum: 410,
        repositoryCommitCount: 10,
        maxExpectedOccurrences: 1,
      })
    ).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        '- Commit `7774a86968b837366e6603cab1142462c8f33ea5` is lucky! It contains **777**!.',
        '',
      ].join('\n'),
    })

    expect(
      mb.build({
        commitIds: ['7774a86968b837366e6603cab1142462c8f33ea5'],
        prNum: 410,
        repositoryCommitCount: 1000,
        maxExpectedOccurrences: 1,
      })
    ).toEqual({
      lucky: false,
      body: '# :tada: Happy commit!\n',
    })
  })

  it('keeps additional rules even when built-in rarity filtering is active', () => {
    const context = {
      commitIds: ['abc777def'],
      prNum: 10000,
      repositoryCommitCount: 1000,
      maxExpectedOccurrences: 0,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {},
      [
        {
          kind: 'commit',
          rule: /777/,
          message: 'Custom match for `{{commitId}}`: **{{matched}}**',
        },
      ]
    )
    const message = mb.build(context)

    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        '- Custom match for `abc777def`: **777**',
        '',
      ].join('\n'),
    })
  })

  it('appends additional rules before built-in rules', () => {
    const context = {
      commitIds: ['abcdef123'],
      prNum: 42,
    }
    const mb = new CustomMessageBuilder(
      '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}',
      {},
      [
        {
          kind: 'commit',
          rule: /abc/,
          message: 'Custom match for `{{commitId}}`: **{{matched}}**',
        },
      ]
    )
    const message = mb.build(context)

    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        '- Custom match for `abcdef123`: **abc**',
        '- Commit `abcdef123` is lucky! It contains **123**!.',
        '',
      ].join('\n'),
    })
  })
})
