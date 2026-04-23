import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/action'

import {
  getCommitIds,
  getRepositoryCommitCount,
  getUserLogin,
  updateMessage,
} from './github'
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

function getMaxExpectedOccurrences(
  input = process.env.INPUT_MAX_EXPECTED_OCCURRENCES
): number | undefined {
  if (!input) {
    return undefined
  }

  const value = Number(input)
  if (!Number.isFinite(value) || value < 0) {
    throw new Error('max_expected_occurrences must be a non-negative number')
  }

  return value
}

async function resolveRepositoryCommitCount(
  octokit: Octokit,
  maxExpectedOccurrences: number | undefined,
  defaultBranch: string | undefined
): Promise<number> {
  if (maxExpectedOccurrences === undefined || !defaultBranch) {
    return 0
  }

  return getRepositoryCommitCount(octokit, defaultBranch)
}

function formatUnexpectedError(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

async function run() {
  try {
    const context = github.context
    const octokit = new Octokit()
    const userLogin = await getUserLogin(octokit)
    const prNum = context.issue.number
    const commitIds = await getCommitIds(octokit)
    const maxExpectedOccurrences = getMaxExpectedOccurrences()
    const repositoryCommitCount = await resolveRepositoryCommitCount(
      octokit,
      maxExpectedOccurrences,
      context.payload.repository?.default_branch
    )
    const mb = new CustomMessageBuilder(BASE_TEMPLATE, {}, getAdditionalRules())
    const message = mb.build({
      commitIds,
      prNum,
      repositoryCommitCount,
      maxExpectedOccurrences,
    })
    await updateMessage(octokit, prNum, userLogin, message)
  } catch (error) {
    core.setFailed(`Unexpected error: ${formatUnexpectedError(error)}`)
  }
}

run().then()
