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
  message: string;
  rule: Rule;
}
