import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/action';

import { getCommitIds, getUserLogin, updateMessage } from './github';
import { MessageForRule } from './interfaces';
import { CustomMessageBuilder } from './message_builder';
import { parseRules } from './rules';

async function run() {
  try {
    const context = github.context;
    const octokit = new Octokit();
    const userLogin = await getUserLogin(octokit);
    const prNum = context.issue.number;
    const commitIds = await getCommitIds(octokit);
    let additionalRules: MessageForRule[] = [];
    if (process.env.INPUT_additional_rules) {
      additionalRules = parseRules(process.env.INPUT_additional_rules);
    }
    const mb = new CustomMessageBuilder(
      `# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}`,
      {},
      additionalRules
    );
    const message = mb.build({ commitIds, prNum });
    await updateMessage(octokit, prNum, userLogin, message);
  } catch (error) {
    core.setFailed('Unexpected error');
  }
}

if (require.main === module) {
  run().then();
}
