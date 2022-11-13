import { LuckyJudgeContext, MessageContext, MessageForRule } from './interfaces';
export declare class MessageBuilder {
    rules: MessageForRule[];
    baseTemplate: string;
    constructor(rules: MessageForRule[], baseTemplate: string);
    prRules(): MessageForRule[];
    commitRules(): MessageForRule[];
    build(context: LuckyJudgeContext): MessageContext;
}
export declare function buildMessage(context: LuckyJudgeContext): MessageContext;
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist