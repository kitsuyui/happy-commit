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
