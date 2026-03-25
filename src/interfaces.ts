export interface MessageContext {
  lucky: boolean
  body: string
}

export interface Comment {
  id: number
  body: string
}

export interface LuckyJudgeContext {
  commitIds: string[]
  prNum: number
  repositoryCommitCount: number
  maxExpectedOccurrences?: number
}

export interface LuckyCommitResult {
  lucky: boolean
  match: string
}

export type Rule = RegExp

export type Message = string

export interface MessageForRule {
  id?: string
  kind: 'commit' | 'pr'
  rule: Rule
  message: string
  expectedOccurrences?: (context: LuckyJudgeContext) => number
}
export type MessageForRuleSet = MessageForRule[]
export type NamedMessageForRuleSet = {
  [key: string]: MessageForRule
}

export type RuleStringPattern = {
  kind: 'pr' | 'commit'
  rule: string
  message: string
}
export type RuleStringPatterns = RuleStringPattern[]
