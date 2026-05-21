import { MessageForRuleSet, NamedMessageForRuleSet, RuleStringPattern } from "./interfaces.mjs";

//#region src/rules.d.ts
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
export { type RuleStringPattern, Rules, RulesKey, parseRules };
//# sourceMappingURL=rules.d.mts.map