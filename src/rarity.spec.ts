import { describe, expect, it } from 'vitest'

import {
  expectedAllSevens,
  expectedCommitHits123,
  expectedCommitHits666,
  expectedCommitHits777,
  expectedCommitHitsHexspeak,
  expectedCommitHitsSameNumbers,
  expectedPowersOfTen,
  expectedPowersOfTwo,
  isRareEnough,
} from './rarity'

describe('rarity helpers', () => {
  it('counts power-of-ten pull request milestones up to the current PR', () => {
    expect(expectedPowersOfTen(9)).toBe(0)
    expect(expectedPowersOfTen(10)).toBe(1)
    expect(expectedPowersOfTen(999)).toBe(2)
    expect(expectedPowersOfTen(10000)).toBe(4)
  })

  it('counts configured power-of-two pull request milestones', () => {
    expect(expectedPowersOfTwo(511)).toBe(0)
    expect(expectedPowersOfTwo(512)).toBe(1)
    expect(expectedPowersOfTwo(4096)).toBe(4)
  })

  it('counts only all-seven pull request milestones', () => {
    expect(expectedAllSevens(776)).toBe(0)
    expect(expectedAllSevens(777)).toBe(1)
    expect(expectedAllSevens(7777)).toBe(2)
    expect(expectedAllSevens(7778)).toBe(2)
  })

  it('estimates commit rarity from repository size', () => {
    expect(expectedCommitHits777(0)).toBe(0)
    expect(expectedCommitHits666(1000)).toBeCloseTo(expectedCommitHits777(1000))
    expect(expectedCommitHits123(1000)).toBeCloseTo(expectedCommitHits777(1000))
    expect(expectedCommitHitsSameNumbers(1000)).toBeLessThan(
      expectedCommitHits777(1000)
    )
    expect(expectedCommitHitsHexspeak(1000)).toBeLessThan(
      expectedCommitHits123(1000)
    )
  })

  it('accepts or rejects events based on the configured ceiling', () => {
    expect(isRareEnough(0.5, undefined)).toBe(true)
    expect(isRareEnough(0.5, 1)).toBe(true)
    expect(isRareEnough(1.5, 1)).toBe(false)
  })
})
