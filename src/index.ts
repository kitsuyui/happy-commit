import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/action'

import { getCommitIds, getUserLogin, updateMessage } from './github'
import type { MessageForRule } from './interfaces'
import { CustomMessageBuilder } from './message_builder'
import { parseRules } from './rules'

const BASE_TEMPLATE =
  '# :tada: Happy commit!\n{{#messages}}- {{&.}}\n{{/messages}}'

function getAdditionalRules(
  input = process.env.INPUT_ADDITIONAL_RULES
): MessageForRule[] {
  if (!input) {
    return []
  }

  return parseRules(input)
}

async function run() {
  try {
    const context = github.context
    const octokit = new Octokit()
    const userLogin = await getUserLogin(octokit)
    const prNum = context.issue.number
    const commitIds = await getCommitIds(octokit)
    const mb = new CustomMessageBuilder(BASE_TEMPLATE, {}, getAdditionalRules())
    const message = mb.build({ commitIds, prNum })
    await updateMessage(octokit, prNum, userLogin, message)
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Unexpected error: ${error.message}`)
    } else {
      core.setFailed(`Unexpected error: ${error}`)
    }
  }
}

run().then()
