import{t as e}from"./github-30evUmUL.mjs";const t=`<!-- happy-commit -->`;function n(e){return`${t}\n${e}`}function r(e,t){return e?e.body===t?{type:`noop`}:{type:`update`,commentId:e.id,body:t}:{type:`create`,body:t}}function i(e,t){return t.lucky?r(e,n(t.body)):e?{type:`delete`,commentId:e.id}:{type:`noop`}}async function a(t,n,r,a){let s=e,c=i(await o(t,n,r),a);switch(c.type){case`update`:await t.issues.updateComment({...s.repo,comment_id:c.commentId,body:c.body});return;case`create`:await t.issues.createComment({...s.repo,issue_number:n,body:c.body});return;case`delete`:await t.issues.deleteComment({...s.repo,comment_id:c.commentId});return;case`noop`:return}}async function o(t,n,r){let i=e,a=(await t.issues.listComments({...i.repo,issue_number:n})).data.find(e=>s(e,r));return a?{id:a.id,body:a.body_text||``}:null}function s(e,n){return e.user?.login===n&&(e.body||e.body_text||``).includes(t)}async function c(t){let n=e;return(await t.pulls.listCommits({...n.repo,pull_number:n.issue.number})).data.map(e=>e.sha)}async function l(t,n){let r=e,i=(await t.graphql(`
query ($owner: String!, $repo: String!, $expression: String!) {
  repository(owner: $owner, name: $repo) {
    object(expression: $expression) {
      ... on Commit {
        history(first: 1) {
          totalCount
        }
      }
    }
  }
}
`,{owner:r.repo.owner,repo:r.repo.repo,expression:`refs/heads/${n}`})).repository?.object?.history.totalCount;if(typeof i!=`number`)throw Error(`Could not resolve commit count for ${n}`);return i}async function u(e){return(await e.graphql(`
query {
  viewer {
    login
  }
}`)).viewer.login}export{i as decideCommentAction,c as getCommitIds,l as getRepositoryCommitCount,u as getUserLogin,a as updateMessage};
//# sourceMappingURL=github.mjs.map