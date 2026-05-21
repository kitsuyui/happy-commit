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
const GITHUB_TOKEN_INPUT = 'github-token'
const LEGACY_GITHUB_TOKEN_INPUT = 'GITHUB_TOKEN'
const ADDITIONAL_RULES_INPUT = 'additional-rules'
const LEGACY_ADDITIONAL_RULES_INPUT = 'additional_rules'
const MAX_EXPECTED_OCCURRENCES_INPUT = 'max-expected-occurrences'
const LEGACY_MAX_EXPECTED_OCCURRENCES_INPUT = 'max_expected_occurrences'

function getActionInput(
  inputName: string,
  legacyInputName?: string
): string | undefined {
  const input = core.getInput(inputName)
  if (input) {
    return input
  }

  if (!legacyInputName) {
    return undefined
  }

  const legacyInput = core.getInput(legacyInputName)
  return legacyInput || undefined
}

function setLegacyOctokitTokenInputEnv(): void {
  const token = getActionInput(GITHUB_TOKEN_INPUT, LEGACY_GITHUB_TOKEN_INPUT)
  if (token) {
    process.env.INPUT_GITHUB_TOKEN = token
  }
}

function getAdditionalRules(
  input = getActionInput(ADDITIONAL_RULES_INPUT, LEGACY_ADDITIONAL_RULES_INPUT)
): MessageForRule[] {
  if (!input) {
    return []
  }

  return parseRules(input)
}

function getMaxExpectedOccurrences(
  input = getActionInput(
    MAX_EXPECTED_OCCURRENCES_INPUT,
    LEGACY_MAX_EXPECTED_OCCURRENCES_INPUT
  )
): number | undefined {
  if (!input) {
    return undefined
  }

  const value = Number(input)
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(
      `${MAX_EXPECTED_OCCURRENCES_INPUT} must be a non-negative number`
    )
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
    setLegacyOctokitTokenInputEnv()
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
    core.setOutput('lucky', String(message.lucky))
    await updateMessage(octokit, prNum, userLogin, message)
  } catch (error) {
    core.setFailed(`Unexpected error: ${formatUnexpectedError(error)}`)
  }
}

run().then()
