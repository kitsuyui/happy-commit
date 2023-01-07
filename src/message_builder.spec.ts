import { CustomMessageBuilder } from './message_builder';

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
    };
    const mb = new CustomMessageBuilder(
      `# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}`,
      {}
    );
    const message = mb.build(context);
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
    });
  });

  it('builds congratulatory message when inputs lucky pull request id', () => {
    const context = {
      commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 777,
    };
    const mb = new CustomMessageBuilder(
      `# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}`,
      {}
    );
    const message = mb.build(context);
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        `- Now pull request issue number reaches **777** (777). It's time to celebrate!`,
        '',
      ].join('\n'),
    });
  });

  it('congratulates when pull request id is lucky', () => {
    const context = {
      commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 2000,
    };
    const mb = new CustomMessageBuilder(
      `# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}`,
      {}
    );
    const message = mb.build(context);
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        `- Now pull request issue number reaches **2000**. It's time to celebrate!`,
        '',
      ].join('\n'),
    });
  });

  it('skips congratulatory message when it is not lucky', () => {
    const context = {
      commitIds: ['1243a86968b837366e6603cab1142462c8f33ea5'],
      prNum: 410,
    };
    const mb = new CustomMessageBuilder(
      `# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}`,
      {}
    );
    const message = mb.build(context);
    expect(message).toEqual({
      lucky: false,
      body: '# :tada: Happy commit!\n',
    });
  });
});
