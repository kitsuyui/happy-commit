import { MessageForRuleSet, NamedMessageForRuleSet } from './interfaces';
export declare type RuleStringPattern = {
    kind: 'pr' | 'commit';
    rule: string;
    message: string;
};
export declare function parseRules(json: string): MessageForRuleSet;
export declare const Rules: NamedMessageForRuleSet;
export declare type RulesKey = keyof typeof Rules;
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist