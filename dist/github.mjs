import{t as e}from"./github-D91hw1gk.mjs";const t=`<!-- happy-commit -->`;function n(e){return`${t}\n${e}`}function r(e,t){return e?e.body===t?{type:`noop`}:{type:`update`,commentId:e.id,body:t}:{type:`create`,body:t}}function i(e,t){return t.lucky?r(e,n(t.body)):e?{type:`delete`,commentId:e.id}:{type:`noop`}}async function a(t,n,r){let i=e,a=await c(t,n,r);for(let e of a.slice(0,-1))await t.issues.deleteComment({...i.repo,comment_id:e.id});return a.length>0?a[a.length-1]:null}async function o(e,t,n,r){await s(e,t,n,i(await a(e,t,n),r))}async function s(t,n,r,i){let o=e;switch(i.type){case`update`:await t.issues.updateComment({...o.repo,comment_id:i.commentId,body:i.body});return;case`create`:await t.issues.createComment({...o.repo,issue_number:n,body:i.body}),await a(t,n,r);return;case`delete`:await t.issues.deleteComment({...o.repo,comment_id:i.commentId});return;case`noop`:return}}async function c(t,n,r){let i=e;return(await t.issues.listComments({...i.repo,issue_number:n,per_page:100})).data.filter(e=>l(e,r)).map(e=>({id:e.id,body:e.body||e.body_text||``})).sort((e,t)=>e.id-t.id)}function l(e,n){return e.user?.login===n&&(e.body||e.body_text||``).includes(t)}async function u(t){let n=e;return(await t.pulls.listCommits({...n.repo,pull_number:n.issue.number})).data.map(e=>e.sha)}async function d(t,n){let r=e,i=(await t.graphql(`
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
`,{owner:r.repo.owner,repo:r.repo.repo,expression:`refs/heads/${n}`})).repository?.object?.history?.totalCount;if(typeof i!=`number`)throw Error(`Could not resolve commit count for ${n}`);return i}async function f(e){let t=(await e.graphql(`
query {
  viewer {
    login
  }
}`)).viewer?.login;if(typeof t!=`string`||t.length===0)throw Error(`Could not resolve current user login`);return t}export{i as decideCommentAction,u as getCommitIds,d as getRepositoryCommitCount,f as getUserLogin,o as updateMessage};
//# sourceMappingURL=github.mjs.map