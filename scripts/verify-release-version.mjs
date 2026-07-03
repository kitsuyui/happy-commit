#!/usr/bin/env bun

import { existsSync, readFileSync } from 'node:fs'

const rawTag = process.env.RELEASE_TAG || process.env.GITHUB_REF_NAME || ''

function fail(message) {
  console.error(message)
  process.exit(1)
}

if (!rawTag) {
  fail('RELEASE_TAG or GITHUB_REF_NAME is required.')
}

if (!/^v?\d+\.\d+(?:\.\d+)?(?:[-+][0-9A-Za-z.-]+)?$/.test(rawTag)) {
  fail(
    `Release tag must look like vMAJOR.MINOR or vMAJOR.MINOR.PATCH: ${rawTag}`
  )
}

const tagVersion = rawTag.replace(/^v/, '')
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
const packageVersion = packageJson.version
const acceptedVersions = new Set([packageVersion])

if (packageVersion.endsWith('.0')) {
  acceptedVersions.add(packageVersion.slice(0, -2))
}

if (!acceptedVersions.has(tagVersion)) {
  fail(
    `Release tag ${rawTag} does not match package.json version ${packageVersion}.`
  )
}

const actionYaml = readFileSync('action.yml', 'utf8')

if (!/main:\s*['"]?dist\/index\.mjs['"]?/.test(actionYaml)) {
  fail('action.yml must point runs.main at dist/index.mjs.')
}

if (!existsSync('dist/index.mjs')) {
  fail('dist/index.mjs is missing from the release commit.')
}

console.log(
  `Release tag ${rawTag} matches package.json version ${packageVersion}.`
)
