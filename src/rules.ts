import type {
  MessageForRuleSet,
  NamedMessageForRuleSet,
  RuleStringPatterns,
} from './interfaces'
import { validateRules } from './validate'

export type RuleStringPattern = {
  kind: 'pr' | 'commit'
  rule: string
  message: string
}

/**
 * Parse the rule pattern from JSON string
 * this function does not validate the RegExp pattern
 * @param json {string} the JSON string
 * @returns {RuleStringPatterns} the rule pattern
 * @throws {Error} if the JSON is invalid
 * @throws {Error} if the rule pattern is invalid
 */
function parseRulePatternFromJson(json: string): RuleStringPatterns {
  let parsed: unknown
  try {
    parsed = JSON.parse(json)
  } catch (_e: unknown) {
    throw new Error('Invalid JSON')
  }
  const validated = validateRules(parsed)
  if (validated) {
    return parsed as RuleStringPatterns
  }
  throw new Error(`Invalid rules: ${JSON.stringify(validateRules.errors)}`)
}

/**
 * Parse the rule pattern from JSON string and convert it to rule set
 * @param json {string} the JSON string
 * @returns {MessageForRuleSet} the rule set
 * @throws {Error} if the rule is invalid
 * @throws {Error} if the JSON is invalid
 * @throws {Error} if the rule set is invalid
 */
export function parseRules(json: string): MessageForRuleSet {
  const parsed = parseRulePatternFromJson(json)
  const rules: MessageForRuleSet = []
  for (const rule of parsed) {
    try {
      rules.push({
        kind: rule.kind,
        rule: new RegExp(rule.rule),
        message: rule.message,
      })
    } catch (_e: unknown) {
      throw new Error(`Invalid rule: ${rule.rule}`)
    }
  }
  return rules
}

export const Rules: NamedMessageForRuleSet = {
  pr_reaches_contain_only_one_nonzero_digit: {
    kind: 'pr',
    rule: /(?:^[1-9]0+$)/,
    message: `Now pull request issue number reaches **{{prNum}}**. It's time to celebrate!`,
  },
  pr_reaches_power_of_2: {
    kind: 'pr',
    rule: /(?:^(512|1024|2048|4096|8192|16384|32768|65536)$)/,
    message: `Now pull request issue number reaches **{{prNum}}** (power of 2). It's time to celebrate!`,
  },
  pr_reaches_777: {
    kind: 'pr',
    rule: /(?:^7{3,}$)/,
    message: `Now pull request issue number reaches **{{prNum}}** (777). It's time to celebrate!`,
  },
  commit_hits_777: {
    kind: 'commit',
    rule: /(?:7{3,})/,
    message: 'Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.',
  },
  commit_hits_same_numbers: {
    kind: 'commit',
    rule: /(?:([0-9a-f])\1{4,})/,
    message: 'Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.',
  },
  commit_hits_123: {
    kind: 'commit',
    rule: /(?:123(?:4(?:5(?:6(?:7(?:8(?:9)?)?)?)?)?)?)/,
    message: 'Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.',
  },
  commit_hits_hexspeak: {
    kind: 'commit',
    rule: /(?:(?:f00d|feed|cafe|c0ffee|deadbeef|defecated|0ffice|badcable))/i,
    message: 'Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.',
  },
  commit_hits_666: {
    kind: 'commit',
    rule: /(?:666)/,
    message:
      'Commit `{{commitId}}` is unlucky... It contains **{{matched}}**!.',
  },
} as const

export type RulesKey = keyof typeof Rules
