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
}
interface LuckyCommitResult {
  lucky: boolean;
  match: string;
}
type Rule = RegExp;
type Message = string;
interface MessageForRule {
  kind: 'commit' | 'pr';
  rule: Rule;
  message: string;
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
//# sourceMappingURL=interfaces.d.cts.map