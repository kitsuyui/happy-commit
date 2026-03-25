//#region src/rarity.d.ts
interface RarityContext {
  prNum: number;
  repositoryCommitCount: number;
}
declare function expectedPowersOfTen(prNum: number): number;
declare function expectedPowersOfTwo(prNum: number): number;
declare function expectedAllSevens(prNum: number): number;
declare function expectedCommitHits777(repositoryCommitCount: number): number;
declare function expectedCommitHits666(repositoryCommitCount: number): number;
declare function expectedCommitHits123(repositoryCommitCount: number): number;
declare function expectedCommitHitsSameNumbers(repositoryCommitCount: number): number;
declare function expectedCommitHitsHexspeak(repositoryCommitCount: number): number;
declare function isRareEnough(expectedOccurrences: number, maxExpectedOccurrences?: number): boolean;
//#endregion
export { RarityContext, expectedAllSevens, expectedCommitHits123, expectedCommitHits666, expectedCommitHits777, expectedCommitHitsHexspeak, expectedCommitHitsSameNumbers, expectedPowersOfTen, expectedPowersOfTwo, isRareEnough };
//# sourceMappingURL=rarity.d.mts.map