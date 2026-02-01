import { MessageForRuleSet, NamedMessageForRuleSet } from "./interfaces.mjs";

//#region src/rules.d.ts
type RuleStringPattern = {
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
declare function parseRules(json: string): MessageForRuleSet;
declare const Rules: NamedMessageForRuleSet;
type RulesKey = keyof typeof Rules;
//#endregion
export { RuleStringPattern, Rules, RulesKey, parseRules };
//# sourceMappingURL=rules.d.mts.map