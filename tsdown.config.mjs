import licenses from 'rollup-plugin-license'
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
  plugins: [
    licenses({
      thirdParty: {
        output: {
          file: 'dist/LICENSES.txt',
          template(dependencies) {
            return dependencies
              .map(
                (dependency) =>
                  `${dependency.name}:${dependency.version} -- ${dependency.licenseText}`
              )
              .join('\n')
          },
        },
      },
    }),
  ],
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
