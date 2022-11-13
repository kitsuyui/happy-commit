export declare const Rules: {
    readonly pr_reaches_power_of_10: {
        readonly kind: "pr";
        readonly rule: RegExp;
        readonly message: "Now pull request issue number reaches **{{prNum}}**. It's time to celebrate!";
    };
    readonly pr_reaches_power_of_2: {
        readonly kind: "pr";
        readonly rule: RegExp;
        readonly message: "Now pull request issue number reaches **{{prNum}}** (power of 2). It's time to celebrate!";
    };
    readonly pr_reaches_777: {
        readonly kind: "pr";
        readonly rule: RegExp;
        readonly message: "Now pull request issue number reaches **{{prNum}}** (777). It's time to celebrate!";
    };
    readonly commit_hits_777: {
        readonly kind: "commit";
        readonly rule: RegExp;
        readonly message: "Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.";
    };
    readonly commit_hits_same_numbers: {
        readonly kind: "commit";
        readonly rule: RegExp;
        readonly message: "Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.";
    };
    readonly commit_hits_123: {
        readonly kind: "commit";
        readonly rule: RegExp;
        readonly message: "Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.";
    };
    readonly commit_hits_hexspeak: {
        readonly kind: "commit";
        readonly rule: RegExp;
        readonly message: "Commit `{{commitId}}` is lucky! It contains **{{matched}}**!.";
    };
    readonly commit_hits_666: {
        readonly kind: "commit";
        readonly rule: RegExp;
        readonly message: "Commit `{{commitId}}` is unlucky... It contains **{{matched}}**!.";
    };
};
export declare type RulesKey = keyof typeof Rules;
//# sourceMappingURL=file:///Users/yui/Documents/Develop/repo/github.com/kitsuyui/happy-commit/src/dist