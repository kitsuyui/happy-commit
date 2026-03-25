const SHA_LENGTH = 40

export interface RarityContext {
  prNum: number
  repositoryCommitCount: number
}

function slidingWindows(length: number): number {
  return Math.max(0, SHA_LENGTH - length + 1)
}

function expectedOccurrencesFromSubstringProbability(
  repositoryCommitCount: number,
  substringLength: number
): number {
  return (
    repositoryCommitCount *
    (slidingWindows(substringLength) / 16 ** substringLength)
  )
}

export function expectedPowersOfTen(prNum: number): number {
  let count = 0
  let current = 10

  while (current <= prNum) {
    count += 1
    current *= 10
  }

  return count
}

export function expectedPowersOfTwo(prNum: number): number {
  const values = [512, 1024, 2048, 4096, 8192, 16384, 32768, 65536]
  return values.filter((value) => value <= prNum).length
}

export function expectedAllSevens(prNum: number): number {
  let count = 0

  for (let digits = 3; digits <= prNum.toString().length; digits += 1) {
    const value = Number.parseInt('7'.repeat(digits), 10)
    if (value <= prNum) {
      count += 1
    }
  }

  return count
}

export function expectedCommitHits777(repositoryCommitCount: number): number {
  return expectedOccurrencesFromSubstringProbability(repositoryCommitCount, 3)
}

export function expectedCommitHits666(repositoryCommitCount: number): number {
  return expectedOccurrencesFromSubstringProbability(repositoryCommitCount, 3)
}

export function expectedCommitHits123(repositoryCommitCount: number): number {
  return expectedOccurrencesFromSubstringProbability(repositoryCommitCount, 3)
}

export function expectedCommitHitsSameNumbers(
  repositoryCommitCount: number
): number {
  return repositoryCommitCount * (slidingWindows(5) / 16 ** 4)
}

export function expectedCommitHitsHexspeak(
  repositoryCommitCount: number
): number {
  const patterns = [
    'f00d',
    'feed',
    'cafe',
    'c0ffee',
    'deadbeef',
    'defecated',
    '0ffice',
    'badcable',
  ]

  const probability = patterns.reduce((sum, pattern) => {
    return sum + slidingWindows(pattern.length) / 16 ** pattern.length
  }, 0)

  return repositoryCommitCount * probability
}

export function isRareEnough(
  expectedOccurrences: number,
  maxExpectedOccurrences?: number
): boolean {
  if (maxExpectedOccurrences === undefined) {
    return true
  }

  return expectedOccurrences <= maxExpectedOccurrences
}
