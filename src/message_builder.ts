import { LuckyJudgeContext, MessageContext } from './interfaces';
import {
  checkLuckyCommitId,
  isEveryDigit7,
  isLuckyNumberBase10,
} from './rules';

export function buildMessage(context: LuckyJudgeContext): MessageContext {
  const { commitIds, prNum } = context;
  const messages = [];
  let lucky = false;

  if (isEveryDigit7(prNum) || isLuckyNumberBase10(prNum)) {
    messages.push(
      `- Now pull request issue number reaches **${prNum}**. It's time to celebrate!`
    );
    lucky = true;
  }

  for (const commitId of commitIds) {
    const result = checkLuckyCommitId(commitId);
    if (result.lucky) {
      messages.push(
        `- Commit \`${commitId}\` is lucky! It contains **${result.match}**!.`
      );
      lucky = true;
    }
  }
  if (lucky) {
    return {
      lucky,
      body: '# :tada: Happy commit!\n' + messages.join('\n'),
    };
  }
  return {
    lucky: false,
    body: '',
  };
}
