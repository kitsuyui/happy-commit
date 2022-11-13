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
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist