import { beforeEach, describe, expect, it, vi } from 'vitest'

type CoreMock = {
  getInput: ReturnType<typeof vi.fn>
  setOutput: ReturnType<typeof vi.fn>
  setFailed: ReturnType<typeof vi.fn>
}

type GithubModuleMock = {
  getCommitIds: ReturnType<typeof vi.fn>
  getRepositoryCommitCount: ReturnType<typeof vi.fn>
  getUserLogin: ReturnType<typeof vi.fn>
  updateMessage: ReturnType<typeof vi.fn>
}

type MessageBuilderMock = {
  build: ReturnType<typeof vi.fn>
}

type EntrypointContext = {
  issue: { number: number }
  payload: { repository?: { default_branch?: string } }
}

type ImportEntrypointOptions = {
  coreMock?: CoreMock
  githubModuleMock?: GithubModuleMock
  context?: EntrypointContext
  buildResult?: { lucky: boolean; body: string }
  parseRulesResult?: unknown[]
}

type EntrypointSetup = {
  coreMock: CoreMock
  githubModuleMock: GithubModuleMock
  context: EntrypointContext
  messageBuilderMock: MessageBuilderMock
  octokitConstructor: ReturnType<typeof vi.fn>
  octokitInstance: { tag: string }
  parseRules: ReturnType<typeof vi.fn>
}

function createCoreMock(inputs: Record<string, string>): CoreMock {
  return {
    getInput: vi.fn((name: string) => inputs[name] ?? ''),
    setOutput: vi.fn(),
    setFailed: vi.fn(),
  }
}

function createGithubModuleMock(): GithubModuleMock {
  return {
    getCommitIds: vi.fn().mockResolvedValue(['deadbeef']),
    getRepositoryCommitCount: vi.fn().mockResolvedValue(42),
    getUserLogin: vi.fn().mockResolvedValue('github-actions[bot]'),
    updateMessage: vi.fn().mockResolvedValue(undefined),
  }
}

function createDefaultContext(): EntrypointContext {
  return {
    issue: { number: 123 },
    payload: { repository: { default_branch: 'main' } },
  }
}

function createDefaultBuildResult() {
  return {
    lucky: true,
    body: 'celebrate',
  }
}

function createEntrypointSetup(
  options: ImportEntrypointOptions = {}
): EntrypointSetup {
  const {
    coreMock = createCoreMock({}),
    githubModuleMock = createGithubModuleMock(),
    context = createDefaultContext(),
    buildResult = createDefaultBuildResult(),
    parseRulesResult = [{ kind: 'pr' }],
  } = options
  const octokitInstance = { tag: 'octokit-instance' }
  const messageBuilderMock: MessageBuilderMock = {
    build: vi.fn().mockReturnValue(buildResult),
  }
  const parseRules = vi.fn().mockReturnValue(parseRulesResult)
  const octokitConstructor = vi.fn(function OctokitMock() {
    return octokitInstance
  })

  return {
    coreMock,
    githubModuleMock,
    context,
    messageBuilderMock,
    octokitConstructor,
    octokitInstance,
    parseRules,
  }
}

function registerEntrypointMocks(setup: EntrypointSetup) {
  class CustomMessageBuilderMock {
    build = setup.messageBuilderMock.build
  }

  vi.doMock('@actions/core', () => setup.coreMock)
  vi.doMock('@actions/github', () => ({ context: setup.context }))
  vi.doMock('@octokit/action', () => ({ Octokit: setup.octokitConstructor }))
  vi.doMock('./github', () => setup.githubModuleMock)
  vi.doMock('./message_builder', () => ({
    CustomMessageBuilder: CustomMessageBuilderMock,
  }))
  vi.doMock('./rules', () => ({ parseRules: setup.parseRules }))
}

async function importEntrypoint(options: ImportEntrypointOptions = {}) {
  vi.resetModules()

  const setup = createEntrypointSetup(options)
  registerEntrypointMocks(setup)

  await import('./index')
  await vi.dynamicImportSettled()

  return {
    coreMock: setup.coreMock,
    githubModuleMock: setup.githubModuleMock,
    messageBuilderMock: setup.messageBuilderMock,
    octokitConstructor: setup.octokitConstructor,
    octokitInstance: setup.octokitInstance,
    parseRules: setup.parseRules,
  }
}

describe('index entrypoint', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    delete process.env.INPUT_GITHUB_TOKEN
  })

  it('runs the happy path and reports lucky output', async () => {
    const inputs = {
      'github-token': 'token-123',
      'additional-rules':
        '[{"kind":"pr","rule":"1","message":"celebrate one"}]',
      'max-expected-occurrences': '3',
    }

    const {
      coreMock,
      githubModuleMock,
      messageBuilderMock,
      octokitConstructor,
      octokitInstance,
      parseRules,
    } = await importEntrypoint({
      coreMock: createCoreMock(inputs),
    })

    expect(process.env.INPUT_GITHUB_TOKEN).toBe('token-123')
    expect(octokitConstructor).toHaveBeenCalledTimes(1)
    expect(githubModuleMock.getUserLogin).toHaveBeenCalledWith(octokitInstance)
    expect(githubModuleMock.getCommitIds).toHaveBeenCalledWith(octokitInstance)
    expect(githubModuleMock.getRepositoryCommitCount).toHaveBeenCalledWith(
      octokitInstance,
      'main'
    )
    expect(parseRules).toHaveBeenCalledWith(inputs['additional-rules'])
    expect(messageBuilderMock.build).toHaveBeenCalledWith({
      commitIds: ['deadbeef'],
      prNum: 123,
      repositoryCommitCount: 42,
      maxExpectedOccurrences: 3,
    })
    expect(coreMock.setOutput).toHaveBeenCalledWith('lucky', 'true')
    expect(githubModuleMock.updateMessage).toHaveBeenCalledWith(
      octokitInstance,
      123,
      'github-actions[bot]',
      { lucky: true, body: 'celebrate' }
    )
    expect(coreMock.setFailed).not.toHaveBeenCalled()
  })

  it('accepts legacy input aliases and skips commit count without a default branch', async () => {
    const inputs = {
      GITHUB_TOKEN: 'legacy-token',
      additional_rules: '[{"kind":"pr","rule":"2","message":"celebrate two"}]',
      max_expected_occurrences: '7',
    }

    const { coreMock, githubModuleMock, messageBuilderMock, parseRules } =
      await importEntrypoint({
        coreMock: createCoreMock(inputs),
        context: {
          issue: { number: 456 },
          payload: { repository: {} },
        },
        buildResult: { lucky: false, body: 'not lucky' },
      })

    expect(process.env.INPUT_GITHUB_TOKEN).toBe('legacy-token')
    expect(githubModuleMock.getRepositoryCommitCount).not.toHaveBeenCalled()
    expect(parseRules).toHaveBeenCalledWith(inputs.additional_rules)
    expect(messageBuilderMock.build).toHaveBeenCalledWith({
      commitIds: ['deadbeef'],
      prNum: 456,
      repositoryCommitCount: 0,
      maxExpectedOccurrences: 7,
    })
    expect(coreMock.setOutput).toHaveBeenCalledWith('lucky', 'false')
    expect(coreMock.setFailed).not.toHaveBeenCalled()
  })

  it('fails when max-expected-occurrences is invalid', async () => {
    const coreMock = createCoreMock({
      'max-expected-occurrences': '-1',
    })

    const { githubModuleMock } = await importEntrypoint({ coreMock })

    expect(coreMock.setFailed).toHaveBeenCalledWith(
      'Unexpected error: max-expected-occurrences must be a non-negative number'
    )
    expect(githubModuleMock.getRepositoryCommitCount).not.toHaveBeenCalled()
    expect(githubModuleMock.updateMessage).not.toHaveBeenCalled()
  })

  it('reports downstream failures through core.setFailed', async () => {
    const githubModuleMock = createGithubModuleMock()
    githubModuleMock.getUserLogin.mockRejectedValue(new Error('boom'))
    const coreMock = createCoreMock({})

    await importEntrypoint({
      coreMock,
      githubModuleMock,
    })

    expect(coreMock.setFailed).toHaveBeenCalledWith('Unexpected error: boom')
    expect(githubModuleMock.updateMessage).not.toHaveBeenCalled()
  })
})
