import { MessageForRuleSet, NamedMessageForRuleSet } from './interfaces';
export type RuleStringPattern = {
    kind: 'pr' | 'commit';
    rule: string;
    message: string;
};
/**
 * Parse the rule pattern from JSON string and convert it to rule set
 * @param json {string} the JSON string
 * @returns {MessageForRuleSet} the rule set
 * @throws {Error} if the rule is invalid
 * @throws {Error} if the JSON is invalid
 * @throws {Error} if the rule set is invalid
 */
export declare function parseRules(json: string): MessageForRuleSet;
export declare const Rules: NamedMessageForRuleSet;
export type RulesKey = keyof typeof Rules;
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist