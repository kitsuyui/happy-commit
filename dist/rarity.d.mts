export interface RarityContext {
  prNum: number;
  repositoryCommitCount: number;
}
export declare function expectedSingleNonzeroDigitPrNumbers(prNum: number): number;
export declare function expectedPowersOfTwo(prNum: number): number;
export declare function expectedAllSevens(prNum: number): number;
export declare function expectedCommitHits777(repositoryCommitCount: number): number;
export declare function expectedCommitHits666(repositoryCommitCount: number): number;
export declare function expectedCommitHits123(repositoryCommitCount: number): number;
export declare function expectedCommitHitsSameNumbers(repositoryCommitCount: number): number;
export declare function expectedCommitHitsHexspeak(repositoryCommitCount: number): number;
export declare function isRareEnough(expectedOccurrences: number, maxExpectedOccurrences?: number): boolean;
//# sourceMappingURL=rarity.d.mts.map