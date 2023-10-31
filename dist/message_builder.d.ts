import { LuckyJudgeContext, MessageContext, MessageForRule } from './interfaces';
import { RulesKey } from './rules';
/**
 * MessageBuilder is a class to build a message for a pull request
 *
 * It has two kinds of rules, one is for pull request, the other is for commit.
 */
declare class MessageBuilder {
    rules: MessageForRule[];
    baseTemplate: string;
    constructor(rules: MessageForRule[], baseTemplate: string);
    prRules(): MessageForRule[];
    commitRules(): MessageForRule[];
    build(context: LuckyJudgeContext): MessageContext;
}
/**
 * CustomMessageBuilder is a class to build a message for a pull request with custom rules
 */
export declare class CustomMessageBuilder {
    builder: MessageBuilder;
    constructor(message: string, overrides?: {
        [key in RulesKey]?: boolean;
    }, additionalRules?: MessageForRule[]);
    build(context: LuckyJudgeContext): MessageContext;
}
export {};
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist