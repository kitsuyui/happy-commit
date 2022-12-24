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
export declare type Rule = RegExp;
export declare type Message = string;
export interface MessageForRule {
    kind: 'commit' | 'pr';
    rule: Rule;
    message: string;
}
export declare type MessageForRuleSet = MessageForRule[];
export declare type NamedMessageForRuleSet = {
    [key: string]: MessageForRule;
};
export declare type RuleStringPattern = {
    kind: 'pr' | 'commit';
    rule: string;
    message: string;
};
export declare type RuleStringPatterns = RuleStringPattern[];
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist