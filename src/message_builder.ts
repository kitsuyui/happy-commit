import Mustache from 'mustache'

import type {
  LuckyJudgeContext,
  MessageContext,
  MessageForRule,
} from './interfaces'
import { Rules, type RulesKey } from './rules'

/**
 * MessageBuilder is a class to build a message for a pull request
 *
 * It has two kinds of rules, one is for pull request, the other is for commit.
 */
class MessageBuilder {
  rules: MessageForRule[]
  baseTemplate: string

  constructor(rules: MessageForRule[], baseTemplate: string) {
    this.rules = rules
    this.baseTemplate = baseTemplate
  }

  prRules(): MessageForRule[] {
    return this.rules.filter((rule) => rule.kind === 'pr')
  }

  commitRules(): MessageForRule[] {
    return this.rules.filter((rule) => rule.kind === 'commit')
  }

  private renderMessages<
    T extends Record<string, string | RegExpMatchArray | number>,
  >(rules: MessageForRule[], values: T[], valueName: keyof T): string[] {
    const messages: string[] = []

    for (const { rule, message } of rules) {
      for (const value of values) {
        const target = value[valueName]
        if (typeof target !== 'string') {
          continue
        }
        const matched = target.match(rule)
        if (matched) {
          messages.push(Mustache.render(message, { ...value, matched }))
        }
      }
    }

    return messages
  }

  build(context: LuckyJudgeContext): MessageContext {
    const { commitIds, prNum } = context
    const messages = [
      ...this.renderMessages(
        this.prRules(),
        [{ prNum: prNum.toString() }],
        'prNum'
      ),
      ...this.renderMessages(
        this.commitRules(),
        commitIds.map((commitId) => ({ commitId })),
        'commitId'
      ),
    ]

    const body = Mustache.render(this.baseTemplate, { messages })
    return {
      lucky: messages.length > 0,
      body,
    }
  }
}

const defaultRules = {
  pr_reaches_contain_only_one_nonzero_digit: true,
  pr_reaches_power_of_2: true,
  pr_reaches_777: true,
  commit_hits_777: true,
  commit_hits_same_numbers: true,
  commit_hits_123: true,
  commit_hits_hexspeak: true,
  commit_hits_666: true,
} as { [key in RulesKey]: boolean }

/**
 * CustomMessageBuilder is a class to build a message for a pull request with custom rules
 */
export class CustomMessageBuilder {
  builder: MessageBuilder

  constructor(
    message: string,
    overrides: { [key in RulesKey]?: boolean } = {},
    additionalRules: MessageForRule[] = []
  ) {
    const rules: MessageForRule[] = [...additionalRules].concat(
      Object.entries(Rules)
        .filter(([key]) => {
          if (key in overrides) {
            return overrides[key as RulesKey]
          }
          return defaultRules[key as RulesKey]
        })
        .map(([, value]) => value)
    )
    this.builder = new MessageBuilder(rules, message)
  }

  build(context: LuckyJudgeContext): MessageContext {
    return this.builder.build(context)
  }
}
