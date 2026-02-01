import { defineConfig } from 'tsdown'

export default defineConfig({
  target: 'es2022',
  format: ['cjs', 'esm'],
  entry: ['./src/**/*.ts', '!./src/**/*.spec.ts'],
  platform: 'node',
  splitting: true,
  treeshake: true,
  sourcemap: true,
  minify: true,
  dts: true,
  skipNodeModulesBundle: true,
  noExternal: [
    '@actions/core',
    '@actions/github',
    '@octokit/action',
    '@octokit/core',
    '@octokit/types',
    'ajv',
    'mustache',
  ],
  inlineOnly: [
    '@actions/core',
    '@actions/github',
    '@octokit/action',
    '@octokit/core',
    '@octokit/types',
    'ajv',
    'mustache',
  ],
})
