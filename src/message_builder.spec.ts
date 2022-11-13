import { buildMessage } from './message_builder';

describe('buildMessage', () => {
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
