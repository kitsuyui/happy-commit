import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/action';

import { getCommitIds, getUserLogin, updateMessage } from './github';
import { buildMessage } from './message_builder';

async function run() {
  try {
    const context = github.context;
    const octokit = new Octokit();
    const userLogin = await getUserLogin(octokit);
    const prNum = context.issue.number;
    const commitIds = await getCommitIds(octokit);
    const message = buildMessage({ commitIds, prNum });
    await updateMessage(octokit, prNum, userLogin, message);
  } catch (error) {
    core.setFailed('Unexpected error');
  }
}

if (require.main === module) {
  run().then();
}
