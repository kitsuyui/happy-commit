import { LuckyJudgeContext, MessageContext } from './interfaces';
import { MessageBuilder } from './message_builder';

describe('MessageBuilder', () => {
  function buildMessage(context: LuckyJudgeContext): MessageContext {
    const mb = new MessageBuilder(
      [
        {
          kind: 'pr',
          rule: /(?:[1]0+)/,
          message: `Now pull request issue number reaches **{{prNum}}**. It's time to celebrate!`,
        },
        {
          kind: 'commit',
          rule: /(?:7{3,})/,
          message:
            'Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.',
        },
      ],
      `# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}`
    );
    return mb.build(context);
  }

  it('builds congratulatory message when inputs lucky commit ids', () => {
    const context = {
      commitIds: [
        '123456789123456789deadbeefdeadbeefdeadbe',
        '123456789123456789d777beefdeadbeefdeadbe',
      ],
      prNum: 10000,
    };
    const message = buildMessage(context);
    expect(message).toEqual({
      lucky: true,
      body: [
        '# :tada: Happy commit!',
        `- Now pull request issue number reaches **10000**. It's time to celebrate!`,
        '- Commit `123456789123456789d777beefdeadbeefdeadbe` is lucky! It contains **777**!.',
        '',
      ].join('\n'),
    });
  });
});
