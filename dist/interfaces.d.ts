export interface MessageContext {
    lucky: boolean;
    body: string;
}
export interface Comment {
    id: number;
    body: string;
}
export interface LuckyJudgeContext {
    commitIds: string[];
    prNum: number;
}
export interface LuckyCommitResult {
    lucky: boolean;
    match: string;
}
export type Rule = RegExp;
export type Message = string;
export interface MessageForRule {
    kind: 'commit' | 'pr';
    rule: Rule;
    message: string;
}
export type MessageForRuleSet = MessageForRule[];
export type NamedMessageForRuleSet = {
    [key: string]: MessageForRule;
};
export type RuleStringPattern = {
    kind: 'pr' | 'commit';
    rule: string;
    message: string;
};
export type RuleStringPatterns = RuleStringPattern[];
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist