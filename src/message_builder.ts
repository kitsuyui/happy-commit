import Mustache from 'mustache';

import {
  LuckyJudgeContext,
  MessageContext,
  MessageForRule,
} from './interfaces';
import { Rules, RulesKey } from './rules';

class MessageBuilder {
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

const defaultRules = {
  pr_reaches_power_of_10: true,
  pr_reaches_power_of_2: true,
  pr_reaches_777: true,
  commit_hits_777: true,
  commit_hits_same_numbers: true,
  commit_hits_123: true,
  commit_hits_hexspeak: true,
  commit_hits_666: true,
};

export class CustomMessageBuilder {
  builder: MessageBuilder;

  constructor(
    message: string,
    overrides: { [key in RulesKey]?: boolean } = {},
    additionalRules: MessageForRule[] = []
  ) {
    const rules: MessageForRule[] = [...additionalRules].concat(
      Object.entries(Rules)
        .filter(([key]) => {
          if (key in overrides) {
            return overrides[key as RulesKey];
          }
          return defaultRules[key as RulesKey];
        })
        .map(([, value]) => value)
    );
    this.builder = new MessageBuilder(rules, message);
  }

  build(context: LuckyJudgeContext): MessageContext {
    return this.builder.build(context);
  }
}
