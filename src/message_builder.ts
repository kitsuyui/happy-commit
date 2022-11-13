import Mustache from 'mustache';

import {
  LuckyJudgeContext,
  MessageContext,
  MessageForRule,
} from './interfaces';

export class MessageBuilder {
  rules: MessageForRule[];
  baseTemplate: string;

  constructor(rules: MessageForRule[], baseTemplate: string) {
    this.rules = rules;
    this.baseTemplate = baseTemplate;
  }

  prRules(): MessageForRule[] {
    return this.rules.filter((rule) => rule.kind === 'pr');
  }

  commitRules(): MessageForRule[] {
    return this.rules.filter((rule) => rule.kind === 'commit');
  }

  build(context: LuckyJudgeContext): MessageContext {
    const { commitIds, prNum } = context;
    const messages = [];
    let lucky = false;

    for (const { rule, message } of this.prRules()) {
      const matched = prNum.toString().match(rule);
      if (matched) {
        const builtMessage = Mustache.render(message, { matched, prNum });
        messages.push(builtMessage);
        lucky = true;
      }
    }

    for (const { rule, message } of this.commitRules()) {
      for (const commitId of commitIds) {
        const matched = commitId.match(rule);
        if (matched) {
          const builtMessage = Mustache.render(message, { matched, commitId });
          messages.push(builtMessage);
          lucky = true;
        }
      }
    }

    const body = Mustache.render(this.baseTemplate, { messages });
    return {
      lucky,
      body,
    };
  }
}

export function buildMessage(context: LuckyJudgeContext): MessageContext {
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
