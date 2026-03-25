//#region src/interfaces.d.ts
interface MessageContext {
  lucky: boolean;
  body: string;
}
interface Comment {
  id: number;
  body: string;
}
interface LuckyJudgeContext {
  commitIds: string[];
  prNum: number;
  repositoryCommitCount: number;
  maxExpectedOccurrences?: number;
}
interface LuckyCommitResult {
  lucky: boolean;
  match: string;
}
type Rule = RegExp;
type Message = string;
interface MessageForRule {
  id?: string;
  kind: 'commit' | 'pr';
  rule: Rule;
  message: string;
  expectedOccurrences?: (context: LuckyJudgeContext) => number;
}
type MessageForRuleSet = MessageForRule[];
type NamedMessageForRuleSet = {
  [key: string]: MessageForRule;
};
type RuleStringPattern = {
  kind: 'pr' | 'commit';
  rule: string;
  message: string;
};
type RuleStringPatterns = RuleStringPattern[];
//#endregion
export { Comment, LuckyCommitResult, LuckyJudgeContext, Message, MessageContext, MessageForRule, MessageForRuleSet, NamedMessageForRuleSet, Rule, RuleStringPattern, RuleStringPatterns };
//# sourceMappingURL=interfaces.d.mts.map